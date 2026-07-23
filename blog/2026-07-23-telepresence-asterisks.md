---
title: Telepresence Removes Its Asterisks
description: "Telepresence 2.30 and 2.31 remove long-standing caveats: the node-agent attaches without modifying workloads, QUIC takes the API server out of the data path, apply makes the dev environment declarative, and the traffic-manager now authenticates every caller."
slug: telepresence-removes-its-asterisks
authors: thallgren
---

# Eight Days, Two Releases: Telepresence Removes Its Asterisks

Telepresence shipped two major releases eight days apart this July: 2.30 on
the 14th, 2.31 on the 22nd. Together they are the largest step the project
has taken since the 2.x architecture was born, and they share a theme that
only became obvious to me in hindsight. Every capability Telepresence has
promised for years carried an asterisk — a caveat you discovered when you
tried to use it in a real organization. You can attach to any workload
(*if you let us modify it). Your traffic tunnels to your laptop (*every
byte of it through the Kubernetes API server). Your whole team can use it
(*and so can anyone else who reaches the traffic-manager). Your dev
environment is reproducible (*as a wiki page of commands that neither a
colleague nor a CI pipeline can run).

These two releases remove those asterisks. This post walks through each
one — not just what changed, but why it ended up the way it did. Little of
it sprang from a whiteboard: these designs grew out of years of running
into the problems and out of long conversations with the community, and
that background is where the interesting decisions live.

<!-- truncate -->

If you haven't met Telepresence: it is a [CNCF](https://www.cncf.io/) tool
that connects your workstation to a Kubernetes cluster's network, so the
service you are working on runs locally — in your IDE, with your debugger,
with sub-second rebuilds — while behaving as if it were deployed in the
cluster, including receiving live traffic from the services around it.

## Attach without touching the pod

Since the 2.x architecture was born, one thing was always true: to receive
a workload's traffic, Telepresence had to modify the workload. A
traffic-agent sidecar was injected into the pod, which meant the pod
template was rewritten and the pods restarted once when the agent first
arrived.

That design was chosen for good reasons, and they haven't gone away. A
sidecar is unprivileged. It lives inside the pod's own security context,
it can be admitted and audited like any other container, and it allows an
administrator to lock developer RBAC down tightly, because the cluster-side
machinery does the privileged work. For long-lived team installations it is
a sound architecture, and it remains the default.

But the ecosystem around it changed. When the sidecar was designed, "the
pod spec changed" was a non-event. Today it is often an incident: GitOps
pipelines flag any drift from the committed manifests and some are
configured to revert it on sight; admission policies reject pod specs that
mutate after review; platform teams own workloads that product developers
are explicitly not allowed to modify; and some workloads are simply
expensive to restart — a JVM with a long warmup, a stateful service with an
election, a batch worker mid-run. In all of those environments the sidecar
wasn't just inconvenient. It was disqualifying.

The **node-agent**, new in 2.30, is the answer. When you attach to a
workload, the traffic-manager creates a node-pinned Job on the node where
the target pod runs. That agent enters the pod's network namespace from the
outside and serves the attachment from there — the same traffic rerouting,
environment, and volume access as the sidecar provides, but the pod itself
is never modified and never restarts. The consequences follow directly:

- **Attach and detach are instant.** There is no rollout to wait for and no
  restart to schedule. Detaching leaves no trace in the workload — nothing
  for drift detection to find, because there was never any drift.
- **It works on workloads you don't own.** The pod spec is never touched,
  so there is nothing for an admission controller to reject and no
  modification for a policy to forbid.
- **Every replica is covered.** The traffic-manager creates one agent per
  replica and reconciles the set as pods come and go, so scaled workloads
  behave correctly under intercept rather than only intercepting the lucky
  replica.
- **Concurrent developers share agents.** Two people attaching to the same
  workload reuse the same node-agents instead of stacking machinery.

The trade-off deserves to be stated as plainly as the benefits: the
node-agent runs as a privileged Job, because entering another pod's network
namespace from outside is inherently a privileged operation. There is no
clever trick that avoids this; any tool that attaches to unmodified pods
pays it somewhere. What you get to choose is *where* the privilege lives —
in a short-lived, node-pinned Job created on demand by the traffic-manager,
rather than in anything the developer runs. The
[agent-modes guide](/docs/howtos/agent-modes) walks
through choosing between sidecar and node-agent, because both are right,
for different clusters.

If attaching to unmodified workloads via a node-level agent sounds like
[mirrord](https://mirrord.dev), it should — that approach is the one
mirrord is built around, and it is a good one. With 2.30, Telepresence
offers both styles. The two tools still differ substantially in
architecture — Telepresence connects your whole workstation at the network
level, mirrord links a single process at the syscall level — and we
maintain a detailed, even-handed
[comparison](/docs/compare/mirrord) of when each is
the better fit.

## The traffic-manager now knows who's calling

2.31 is a security release, and an overdue one. The uncomfortable truth it
addresses: until now, the traffic-manager trusted its callers. Anyone who
could reach its gRPC endpoint could create sessions, act on other clients'
attachments, and route traffic — without ever proving who they were. Two
High-severity advisories,
[GHSA-j8j4-rw65-56r6](https://github.com/telepresenceio/telepresence/security/advisories/GHSA-j8j4-rw65-56r6)
and
[GHSA-6j3h-rp73-6rvf](https://github.com/telepresenceio/telepresence/security/advisories/GHSA-6j3h-rp73-6rvf),
describe concretely what that made possible: a pod anywhere in the cluster
could claim to be a traffic-agent and intercept a service's traffic, and an
active client session could be hijacked by anyone who learned its ID.

How does a tool end up there? Historically: Telepresence grew up as a
development tool inside clusters that were themselves treated as trusted.
Reachability was the perimeter. That assumption stopped being defensible
years ago — clusters are multi-tenant, workloads are semi-trusted, and
"anything in the cluster can call anything else" is precisely the property
zero-trust architectures exist to kill. The fix had to retrofit identity
onto a protocol that never had it, without breaking a single existing
installation. That constraint shaped everything.

The first design decision: **don't invent a credential system.** The
cluster already has one. Clients now forward the bearer token their
kubeconfig credentials already resolve to — a static token, a token file,
or the output of an exec credential plugin — and the traffic-manager
validates it with a Kubernetes `TokenReview`. The identity a client
presents is exactly the identity the cluster would assign it; there is
nothing new to provision, rotate, or leak. Traffic-agents authenticate with
a projected, audience-bound ServiceAccount token, which proves not just
*what* they are but *which pod* they are — closing the
impersonate-an-agent hole specifically.

On top of authentication sit two authorization rules, both built on
concepts the cluster already understands:

- **Sessions are bound to the identity that created them.** A caller can no
  longer act on another client's or agent's session — reviewing someone
  else's intercept, detaching someone else's attachment, or speaking for a
  pod it does not run in.
- **Creating an intercept requires RBAC** — specifically, the caller's
  Kubernetes identity must hold `pods/portforward` in the target namespace,
  checked with a `SubjectAccessReview`. That permission was chosen
  deliberately: it is what `kubectl port-forward` already requires, and an
  intercept is, in capability terms, a port-forward. No new policy
  language, no Telepresence-specific roles to design; if your cluster's
  RBAC already says who may forward traffic to pods, it now also says who
  may intercept them.

The second design decision is about rollout, and it reflects a sociological
observation as much as a technical one: **security upgrades that break
existing installations don't get installed.** They get postponed, pinned
around, and resented — and an unapplied security fix protects nobody. So
enforcement is opt-in, governed by one Helm value with three settings.
`permissive`, the default, validates every token and logs every
authorization decision but rejects nothing: upgrading changes nothing for
your users, while the log tells you exactly what enforcement *would* have
done. `enforcing` turns the rejections on. (`disabled` exists for the
installations that genuinely want the old behavior.) The intended path is
unexciting by design: upgrade, let the client and agent fleet catch up,
watch the permissive logs until they are quiet, flip the switch. Older
clients keep working against a permissive manager, and a 2.31 client keeps
working against an older manager — the fleet only has to be current for the
final step.

The full details, including what each kubeconfig credential type provides,
are in the new
[authentication reference](/docs/reference/authentication).

## QUIC: taking the API server out of the data path

All tunneled traffic between the workstation and the cluster has
historically traveled a single port-forwarded gRPC connection. That design
has one great virtue: it works everywhere. If you can reach the Kubernetes
API server, you can port-forward, and if you can port-forward, Telepresence
works — no LoadBalancer, no open ports, no firewall conversation.

But look at what it costs. A port-forward rides the API server connection,
which means every byte of tunneled development traffic — every request your
service receives, every call it makes upstream — passes through the
cluster's control plane. The API server is the most critical and most
contended component a cluster has, and it was never meant to be a data
plane. For a single developer the load is noise; for a platform team
running Telepresence across an organization, it is measurable, and it is
spent on exactly the wrong component.

The single connection hurts the developer, too. One gRPC connection is one
TCP stream, and multiplexing every flow over one TCP stream buys TCP's
worst property at scale: head-of-line blocking. When a packet is lost, TCP
holds back everything behind it until the retransmission arrives —
including bytes belonging to unrelated flows that merely shared the pipe.
On a clean network you never notice. On a lossy one — hotel Wi-Fi, a VPN
concentrator having a bad day, a congested last mile — every flow
periodically pays for every other flow's bad luck, and the tunnel feels
mysteriously laggy in a way that is hard to attribute.

The opt-in QUIC transport in 2.31 addresses both at once. The client
connects directly to a QUIC endpoint the traffic-manager exposes, so
tunneled traffic bypasses the API server entirely — the control plane goes
back to doing control-plane work. And because QUIC gives each stream
independent loss recovery, a lost packet stalls only the flow it belongs
to. Our benchmarks bear both out: at 1–3% ingress packet loss, tail
latencies for small-request traffic over the shared gRPC tunnel ran
**1.7–1.8x higher** than over QUIC — and tail latency on small requests is
exactly what interactive development feels — while the gains are not
confined to lossy networks: in a number of benchmark shapes, the direct
QUIC path was several times faster outright.

Why opt-in? Because the property that makes the gRPC tunnel universal is
one QUIC cannot have. A QUIC endpoint must be reachable as a UDP service —
a LoadBalancer or a NodePort — which is an administrator's decision, and
not every cluster can offer it. So the traffic-manager exposes QUIC when
`quicTunnel.enabled` is set, clients upgrade new tunneled connections to it
automatically when it is reachable, and gRPC remains both the default and
the always-available fallback. `telepresence status` tells you which
transport you actually got — no guessing.

## Your dev environment is now a file

Kubernetes won on the strength of a single idea: describe the state you
want, and let a controller make it so. Yet the workstation side of
cluster-native development has remained stubbornly imperative — connect to
this cluster, intercept that service with these nine flags, start the local
server, repeat tomorrow, and onboard new teammates by pointing them at a
wiki page that was accurate two quarters ago.

`telepresence apply -f dev.yaml`, new in 2.31, brings the declarative model
to the workstation. The manifest describes an optional connection and a set
of attachments — intercept, replace, ingest, or wiretap — each with its
flags and, optionally, a local command to run while the attachment is up:
your dev server, started when the attachment is ready and stopped when it
is torn down. Apply is idempotent: what already matches the manifest is
left alone, what has drifted is re-created, and `--dry-run` shows the plan
without touching anything. `telepresence delete -f` tears the whole state
down again.

The practical shift is bigger than the feature list suggests. A team's
standard development setup stops being tribal knowledge and becomes a file
in the repo — versioned, reviewed, and identical for the new hire and the
veteran. "How do I get set up on this service?" becomes
`telepresence apply -f dev.yaml`, and the answer is the same on everyone's
machine.

## What's next: moving the cluster knowledge into the tool

The features above make Telepresence more capable. The next initiative
attacks a different problem: the first hour.

Installing a traffic-manager that actually fits a cluster requires
answering questions about that cluster. Can it expose a QUIC endpoint, and
should that be a LoadBalancer or a NodePort? Will the node-agent pass the
cluster's admission policies? Can the mutating webhook be created, and can
the API server reach it? Should the install be cluster-wide or scoped to
namespaces, and which ones? Is something already installed, and is it
healthy? Today, the answers live in the reference docs and in
trial-and-error, which is a real cost for the person evaluating whether
Telepresence is worth adopting at all — the people most familiar with these
questions are the ones who need the docs least.

The upcoming `telepresence setup` command, planned for one of the next
releases, moves that
knowledge into the tool. It probes the cluster read-only — install
privileges, QUIC viability, node-agent admission (with a server-side
dry-run canary that exercises the actual policy engines), webhook
reachability, namespace scale, existing installations and their health,
and even routing conflicts with your workstation's local networks. Then it
asks only the questions the probes leave open, and validates, writes, or
applies a fully configured Helm install. Design decisions worth noting: it
never mutates the workstation, so it is safe to run repeatedly and safe to
run read-only; a values file it writes is a plain Helm values document, so
it slots into GitOps rather than around it; it doubles as a doctor for
existing installations; and when you lack cluster privileges, it produces
an itemized handoff for your admin instead of a dead end.

## Thank you, OpenAI

None of this happens without funded maintainer time, and that is worth
being concrete about. Features like the node-agent or a ground-up
authentication layer are multi-month arcs: design, implementation,
security review, documentation, and the long tail of hardening. That scale
of work does not fit into evenings and weekends — not sustainably, and not
at the quality a security layer demands.

**[OpenAI](https://openai.com) sponsors the Telepresence project.** Not these particular
features — there is no feature direction attached — just sustained support
for the project itself. That is precisely the kind of sponsorship that
gives a maintainer room to take on work this size, and these two releases
are the direct result. Thank you.

Telepresence OSS is a [CNCF](https://www.cncf.io/) project under the
Apache 2.0 license. Everything described in this post is free of charge —
no seats, no paid tier, no feature gates. If your organization gets value
from it, the best ways to give back are
[contributions](https://github.com/telepresenceio/telepresence) and
[sponsorship](https://github.com/sponsors/telepresenceio), which directly fund
maintenance and development.

## Getting started

The [quick start](/docs/quick-start) takes about ten
minutes. The complete lists of changes are in the
[release notes](/docs/release-notes), and questions
and war stories are welcome in
[GitHub Discussions](https://github.com/telepresenceio/telepresence/discussions)
or
[#telepresence-oss](https://cloud-native.slack.com/archives/C06B36KJ85P)
on the CNCF Slack.
