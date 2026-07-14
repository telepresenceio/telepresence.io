---
title: Telepresence 2.30
description: "Telepresence 2.30 introduces the node-agent: attach to workloads without modifying them - no sidecar injection, no pod restarts."
slug: telepresence-2.30
authors: thallgren
---

# Telepresence 2.30.0: Attach Without Touching the Pod

Telepresence 2.30.0 is out, and it changes something that has been true since
the 2.x architecture was born: to receive a workload's traffic, Telepresence
had to modify the workload. The new **node-agent** removes that requirement.
You can now intercept, wiretap, replace, or ingest a workload whose pods are
exactly as their owners deployed them — no sidecar injection, no pod
restarts, no changes for an admission controller to argue with.

<!-- truncate -->

## The cost of the sidecar

The traffic-agent sidecar has served Telepresence well, and it remains the
default. But injecting it has a price: the pod template is rewritten and the
pods restart once when the agent first arrives. In many clusters that price
is fine. In others it is not — workloads that are expensive to restart,
GitOps pipelines that flag any drift from the committed manifests, admission
policies that reject mutated pod specs, or workloads you simply do not own.

## What the node-agent does

When you attach with the node-agent, the traffic-manager creates a
node-pinned Job on the node where the target pod runs. That agent enters the
pod's network namespace from the outside and serves the attachment from
there — the same traffic rerouting, environment, and volume access as the
sidecar, but the pod itself is never modified and never restarts.

The practical consequences:

- **Attach and detach are instant.** No rollout, no restart, no waiting for
  replicas to cycle. Detaching leaves no trace in the workload.
- **The workload stays exactly as deployed.** Nothing for GitOps drift
  detection or admission policies to object to, and it works on workloads
  you are not allowed to modify.
- **Every replica is attached.** The traffic-manager creates one agent per
  replica and keeps the set reconciled as pods come and go, so scaled
  workloads behave correctly under intercept.
- **Concurrent attachments share agents.** Multiple developers attaching to
  the same workload share the same node-agents.

There is a trade-off: the node-agent runs as a privileged Job, because
entering another pod's network namespace requires it. The
[agent-modes guide](/docs/howtos/agent-modes) walks through choosing between
the two, and the [node-agent reference](/docs/reference/node-agent) covers
the details.

## Trying it

The administrator enables node-agent mode; the sidecar remains the default:

```console
$ telepresence helm install --set nodeAgent.enabled=true
```

A developer picks it per attachment:

```console
$ telepresence intercept my-service --port 8080 --node-agent
```

or sets it as a personal or cluster-wide default through the
[client configuration](/docs/reference/config#node-agent).

## If this sounds like mirrord

It should — attaching to unmodified workloads via a node-level agent is the
approach [mirrord](https://mirrord.dev) is built around, and it is a good
one. With 2.30, Telepresence offers both styles: the sidecar when you want
long-lived, unprivileged agents and locked-down developer RBAC, and the
node-agent when the workload must stay untouched. The two tools still differ
substantially in architecture — Telepresence connects your whole workstation
at the network level, mirrord links a single process at the syscall level —
and we maintain an honest, detailed
[comparison](/docs/compare/mirrord) if you are choosing between them.

One more difference worth stating plainly: Telepresence OSS is a
[CNCF](https://www.cncf.io/) project under the Apache 2.0 license. Everything
described here is completely free of charge — no seats, no paid tier, no
feature gates. If your organization gets value from it, the best ways to
give back are contributions, and
[sponsorship](https://github.com/sponsors/thallgren), which directly funds
maintenance and development.

## Thank you, OpenAI

On that note: **OpenAI** sponsors the Telepresence project. Not this
particular feature, just support for the project itself. It is that kind of
sponsorship that gives a maintainer the room to take on work the size of the
node-agent, and this release is the result. Thank you.

## Getting started

The [quick start](/docs/quick-start) takes about ten minutes. The full list
of changes in 2.30.0 is in the
[release notes](/docs/release-notes). Questions and war stories are welcome
in [#telepresence-oss](https://cloud-native.slack.com/archives/C06B36KJ85P)
on the CNCF Slack.
