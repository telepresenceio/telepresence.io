---
title: Telepresence 2.31
description: "Telepresence 2.31 is a security release: the traffic-manager now authenticates every caller against the cluster's Kubernetes identities. It also brings an opt-in QUIC transport and declarative workstation state."
slug: telepresence-2.31
authors: thallgren
---

# Telepresence 2.31.0: The Traffic-Manager Now Knows Who's Calling

Telepresence 2.31.0 is a security release. Until now, the traffic-manager
trusted its callers: anyone who could reach its gRPC endpoint could create
sessions, act on other clients' attachments, and route traffic — without
proving who they were. Two advisories,
[GHSA-j8j4-rw65-56r6](https://github.com/telepresenceio/telepresence/security/advisories/GHSA-j8j4-rw65-56r6)
(High) and
[GHSA-6j3h-rp73-6rvf](https://github.com/telepresenceio/telepresence/security/advisories/GHSA-6j3h-rp73-6rvf)
(High), describe what that made possible. This release closes both, and we
recommend upgrading.

<!-- truncate -->

## Every caller now has an identity

The traffic-manager authenticates callers against the cluster's own
Kubernetes identities — no new credential system, no extra configuration:

- **Clients** forward the bearer token their kubeconfig credentials already
  resolve to: a static token, a token file, or the output of an exec
  credential plugin. The traffic-manager validates it with a Kubernetes
  `TokenReview`, so the identity a client presents is exactly the identity
  the cluster would give it.
- **Traffic-agents** present a projected, audience-bound ServiceAccount
  token, so an agent can prove not just what it is but which pod it is.

On top of authentication sit two authorization rules:

- **Sessions are bound to the identity that created them.** A caller can no
  longer act on another client's or agent's session — reviewing an
  intercept, detaching an attachment, or impersonating an agent for a pod it
  does not run in.
- **Creating an intercept requires RBAC.** The caller's Kubernetes identity
  must hold `pods/portforward` access in the target namespace — the same
  permission `kubectl port-forward` would require, checked with a
  `SubjectAccessReview`. Intercepting a workload is now gated by the
  cluster's own access control, not by mere reachability.

The details, including what each kubeconfig credential type provides, are in
the new [authentication reference](/docs/reference/authentication).

## Upgrades don't break: enforcement is opt-in

Authentication strictness is controlled by a new Helm value,
`security.authentication.mode`:

- `permissive` — **the default.** Tokens are validated and authorization
  decisions are logged, but no call is ever rejected. Upgrading the
  traffic-manager changes nothing for your users; the log tells you what
  enforcement would do.
- `enforcing` — calls without a valid token are rejected, and intercepts
  require the RBAC check to pass.
- `disabled` — no token validation at all.

The intended rollout: upgrade the traffic-manager, let your client and agent
fleet catch up to 2.31 or later, watch the permissive logs, then flip the
switch:

```console
$ telepresence helm upgrade --set security.authentication.mode=enforcing
```

Older clients keep working against a permissive traffic-manager, and a 2.31
client keeps working against an older traffic-manager — enforcement is the
only step that requires the fleet to be current.

## Also in this release

**Opt-in QUIC transport for the tunnel.** With `quicTunnel.enabled` set, the
traffic-manager exposes a QUIC endpoint and the client automatically
upgrades new tunneled connections to it. That removes the head-of-line
blocking the shared port-forwarded gRPC connection imposes across flows —
one stalled connection no longer delays the others. The gRPC transport
remains the default and the fallback, and `telepresence status` reports
which transport is active.

**Declarative workstation state.** `telepresence apply -f <manifest>` brings
the workstation to the state a YAML manifest describes: an optional
connection and a set of attachments — intercept, replace, ingest, or
wiretap — each with its flags and, optionally, a local command to run while
the attachment is up. Apply is idempotent, re-creates attachments whose spec
has drifted, and supports `--dry-run`; `telepresence delete -f <manifest>`
tears it down again. Your team's standard dev setup becomes a file in the
repo instead of a wiki page of commands.

**Half the watcher streams.** The client now registers a single combined
watcher with the traffic-manager for workloads and attachments, and bulk
container data is fetched on demand instead of streamed. Fewer streams per
client means a lighter traffic-manager in large installations, with full
backward compatibility in both directions.

The release also fixes ingests into namespaces other than the connected one
losing their mounts on unrelated agent churn, a TTY progress renderer that
could keep rendering stale lines, and install waits aborting on warning
events that belonged to an unrelated object. The complete list is in the
[release notes](/docs/release-notes).

## Getting started

Telepresence OSS is a [CNCF](https://www.cncf.io/) project under the Apache
2.0 license — everything described here is free of charge. The
[quick start](/docs/quick-start) takes about ten minutes. Questions are
welcome in
[GitHub Discussions](https://github.com/telepresenceio/telepresence/discussions)
or [#telepresence-oss](https://cloud-native.slack.com/archives/C06B36KJ85P)
on the CNCF Slack, and if your organization gets value from Telepresence,
[sponsorship](https://github.com/sponsors/thallgren) directly funds its
maintenance and development.
