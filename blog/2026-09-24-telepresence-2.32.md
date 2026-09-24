---
title: Telepresence 2.32
description: "Telepresence 2.32 adds a guided setup command that configures the traffic-manager from a short interview, Direct Connect for clients without Kubernetes API access, and a Telepresence-specific RBAC grant that lets the client run with almost no cluster permissions."
slug: telepresence-2.32
authors: thallgren
---

# Telepresence 2.32.0: Guided Setup and Direct Connect

Telepresence 2.31 taught the traffic-manager to authenticate every caller.
Telepresence 2.32.0 is about making that secure configuration easy to reach,
and about reaching it from places that could not connect before. A new
`telepresence setup` command looks at your cluster, asks only the questions
it cannot answer itself, and installs or upgrades the traffic-manager
accordingly. Direct Connect lets a client work against a cluster whose
Kubernetes API it cannot reach at all. And a Telepresence-specific RBAC
grant shrinks what a developer needs in the cluster to a handful of
permissions that mean nothing outside Telepresence.

<!-- truncate -->

## Setup asks, verifies, and hands you the values file

Installing the traffic-manager well has meant knowing a dozen Helm values
and how they interact. `telepresence setup` replaces that with an
interview. It first probes the cluster read-only: your install privileges,
whether QUIC and the node-agent are viable, whether the agent-injector
webhook can be reached, how many namespaces there are, and what an existing
installation looks like. Then it asks what the probes left open: whether
developers will attach to workloads or only need cluster access, which
namespaces the traffic-manager should manage, whether to enforce caller
authentication, whether to enable Direct Connect and which certificate to
use, which RBAC grant to require, whether clients older than 2.32 still
need the legacy grants, and how clients should handle subnets that collide
with your VPN.

The answers become a report and a plain Helm values file. `--output` writes
that file for your GitOps repository, `--input` pins earlier decisions so
the next run only asks about what is new, and `--apply` installs or
upgrades. Nothing is changed unless you pass `--apply`, and if you lack the
privileges to install, the report lists exactly which verbs on which
resources to ask an administrator for.

After an apply, setup verifies the result rather than assuming it: the
StatefulSet is ready, the QUIC endpoint answers a real handshake, the
agent-injector has endpoints, and, when Direct Connect is on, the external
endpoint resolves, completes a TLS handshake, and accepts an authenticated
session. When the QUIC probe gets silence, setup says why: UDP rejected by
the host, dropped on the way, or the host unreachable altogether. The
details are in the [setup reference](/docs/reference/setup).

## Direct Connect: no Kubernetes API required

Until now, every Telepresence client needed access to the Kubernetes API,
at minimum to port-forward to the traffic-manager. Some developers do not
have that access and never will: contractors, air-gapped workstations, or
organisations that keep the API server off the developer network on
principle.

Direct Connect publishes the traffic-manager's client-facing gRPC surface
behind a TLS listener, typically through a LoadBalancer Service. A client
configured with `cluster.managerAddress: tls://tm.example.com:443` dials it
directly and makes no Kubernetes API requests from either daemon. It still
authenticates: with the bearer token its kubeconfig credentials resolve to,
or with a client certificate in the TLS handshake when it has no token.

Because the endpoint is exposed, the traffic-manager only publishes it when
authentication is set to `enforcing`, and the certificate must be persisted
in a `kubernetes.io/tls` Secret or issued by cert-manager. Setup handles
both choices and, after verifying the endpoint, prints the
`cluster.managerAddress` and `cluster.managerServerCA` block ready to paste
into the client configuration. Pair it with the QUIC tunnel, which gives
intercepts a direct data path that does not depend on port-forwards. The
[external endpoint reference](/docs/reference/external-endpoint) covers the
setup, the certificate options and the limits.

## Least privilege, one step at a time

The third theme is how little a developer now needs in the cluster.

**A grant that means only Telepresence.** The new Helm setting
`security.authorization.requiredGrant` chooses what the traffic-manager
checks before it lets a client connect or attach. `portforward` keeps the
2.31 behaviour: `pods/portforward` in the target namespace. `telepresence`
instead requires `create` on `connections.telepresence.io` and
`attachments.telepresence.io`, resources that are never sent to the API
server, so granting them confers nothing else. The default, `any`, accepts
either while you migrate. The chart renders matching client Roles bound to
`clientRbac.subjects`; with `requiredGrant: telepresence` and the legacy
grants turned off, this is everything a developer needs to connect and to
intercept two named workloads in one namespace:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: traffic-manager-connect
  namespace: ambassador
rules:
  - apiGroups: [""]
    resources: ["pods/portforward"]
    resourceNames: ["traffic-manager-0"]
    verbs: ["create"]
  - apiGroups: ["telepresence.io"]
    resources: ["connections"]
    verbs: ["create"]
---
kind: Role
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: telepresence-ambassador
  namespace: shop
rules:
  - apiGroups: ["telepresence.io"]
    resources: ["attachments"]
    resourceNames: ["cart", "checkout"]
    verbs: ["create", "get"]
  - apiGroups: ["telepresence.io"]
    resources: ["logs", "logs/yaml"]
    verbs: ["get"]
```

`create` on `attachments` authorizes intercept, replace and wiretap, `get`
authorizes ingest, and the `logs` resources let `telepresence gather-logs`
stream that namespace's logs through the traffic-manager. Nothing here
grants access to pods, services or namespaces themselves. Direct
`pods/portforward` to the traffic-agents is no longer required either, as
long as the QUIC tunnel is enabled: intercepted traffic then reaches the
client over QUIC, and the client learns whether it may port-forward when it
first dials an agent instead of asking the API server at connect time.

**One pod, one name.** The traffic-manager now runs as a single-replica
StatefulSet, so its pod is always `traffic-manager-0`, and clients
port-forward straight to it. A connection therefore needs exactly one
Kubernetes permission: `create` on `pods/portforward` for that one pod
name. The service and pod discovery grants clients used before stay
available behind `clientRbac.legacyAccess`, which is still the default, for
as long as you have clients older than 2.32.

**Logs through the manager.** `telepresence gather-logs` streams manager
and agent logs, and optionally pod manifests, through the traffic-manager,
and a client watching all namespaces learns the managed namespaces the same
way. Clients no longer need to list pods, read pod logs or list namespaces.

Combined, the ladder in the [client RBAC guide](/docs/howtos/client-rbac)
runs from today's defaults down to a client with no Kubernetes grant at
all, and setup asks about every rung but the last.

## Also in this release

**Choose the port that receives non-intercepted traffic.** The
`telepresence.io/inject-inactive-port` annotation names the container port
the traffic-agent forwards traffic to while no intercept is active, for
applications that must keep serving a health or admin port during an
intercept.

**Lighter and steadier.** Most of this release's stability work was
contributed by engineers at OpenAI, who run Telepresence at a scale that
finds the sharp edges. The traffic-agent reuses connections to HTTP
intercept handlers instead of opening a tunnel per request. Agent updates
to clients no longer carry every container's environment. Keepalive
failures repair the session instead of ending it, a client that stops
reading its workload watch no longer holds up delivery to everyone else,
and intercept-only lists no longer wait for the workload watcher. Daemon
logs now say why a session ended. The inactive-port annotation above came
from the same team.

**Windows: an MSI for both architectures, and signatures on the way.**
The Windows setup executable is gone. Telepresence now ships as
`telepresence-windows-amd64.msi` and `telepresence-windows-arm64.msi`,
plain MSI packages that install the CLI and the daemon service and deploy
through Intune or Group Policy as they are. The installer checks for
WinFsp and SSHFS-Win, the two prerequisites for volume mounts, and points
to their downloads when they are missing; the client finds `sshfs-win`
where its installer puts it, or where `intercept.sshfsPath` says.
`telepresence.exe` and the daemon service wrapper carry a version
resource, so Explorer's Properties dialog shows the product name and
version instead of nothing. And the release pipeline can now sign every
Windows artifact with a certificate from
[SignPath Foundation](https://signpath.org/), whose free program for
open-source projects Telepresence is enrolling in. Once the certificate is
issued, the Windows assets of this release are re-signed in place, so
`telepresence.exe` can run elevated in locked-down environments without
per-run approval. The [install page](/docs/install/client) shows how to
verify a download.

Fixes include intercepts in namespaces created after a manager without the
injector started, a traffic-manager restart when switching between
namespace-selector and cluster-wide scope, temporary mount directories that
were never removed, an RPM upgrade that disabled the root daemon service,
mounts left behind on Windows when an intercept ended, and
`telepresence compose --profile`. The full list is in the
[release notes](/docs/release-notes).

## Upgrading

Two changes need attention:

- The traffic-manager becomes a StatefulSet. A pre-upgrade hook removes the
  old Deployment; no value to set. Rolling back to an older chart requires
  an uninstall and reinstall.
- `telepresence intercept --replace`, deprecated since 2.22, is removed.
  Use `telepresence replace`.

## What comes next

The largest item in development is **personal intercepts for Kafka
consumers**. Today an intercept redirects network requests; a consumer that
reads from a topic has nothing to redirect. The work in progress adds an
optional Kafka provider to the chart. An administrator declares a
`KafkaSplit` for a consumer workload, and a developer then intercepts it
with a filter on the record key, a key prefix, or a header:

```console
$ telepresence intercept checkout --kafka-header x-dev=jane
```

Records that match go to the developer's local consumer, everything else
keeps flowing to the application in the cluster, and a transactional
splitter guarantees that each record is committed to exactly one
destination as the original consumer group's offset advances. Several
developers can hold disjoint routes on the same topic at once. It's on a
branch with docs and regression tests, and it will ship when it has proven
itself against real brokers.

## Thank you, OpenAI

[OpenAI](https://openai.com) is a major sponsor of Telepresence, and with
this release also a major contributor: the stability and performance
changes above, the inactive-port annotation, and the groundwork for the
session diagnostics all came from their engineers, reviewed and merged in
the open. Sponsorship keeps the project maintained; contributions like
these make it better for everyone who uses it, and we are grateful for
both.

## Getting started

Telepresence OSS is a [CNCF](https://www.cncf.io/) project under the Apache
2.0 license, and everything described here is free of charge. The
[quick start](/docs/quick-start) takes about ten minutes. Questions are
welcome in
[GitHub Discussions](https://github.com/telepresenceio/telepresence/discussions)
or [#telepresence-oss](https://cloud-native.slack.com/archives/C06B36KJ85P)
on the CNCF Slack, and if your organization gets value from Telepresence,
[sponsorship](https://github.com/sponsors/thallgren) directly funds its
maintenance and development.
