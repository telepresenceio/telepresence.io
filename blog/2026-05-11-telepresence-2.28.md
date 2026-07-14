---
title: Telepresence 2.28
description: What's new in Telepresence 2.28.
slug: telepresence-2.28
authors: thallgren
---

# Telepresence 2.28.0: Namespace-Aware Engagements and Safer Routing

Telepresence 2.28.0 is now available. This release makes it easier to work
across multiple mapped namespaces from a single connection, tightens routing
behavior for `also-proxy` and `never-proxy`, and improves several root daemon,
traffic-agent, and reconnect paths that matter in long-running development
sessions.

<!-- truncate -->

---

## Engage Workloads in Mapped Namespaces

The `intercept`, `wiretap`, and `replace` commands now accept `--namespace`.
That namespace selects the workload targeted by the engagement without changing
the namespace used by `telepresence connect`.

This matters when one Telepresence connection maps several namespaces. You can
keep the connected namespace as the default, while still creating personal HTTP
intercepts in other mapped namespaces:

```bash
telepresence intercept api --namespace team-a --port 8080
telepresence wiretap api --namespace team-b --port 8080
```

For shared clusters, this gives developers a cleaner workflow: connect once,
then choose the workload namespace per engagement instead of reconnecting or
changing global context for every task.

See the [engagement CLI reference](/docs/2.28/reference/engagements/cli) for the
full command behavior.

---

## More Predictable Routing

Telepresence 2.28 includes two routing fixes aimed at making explicit routing
configuration behave exactly as configured.

### Never-proxy routes keep their gateway

Routes installed for `--never-proxy` and
`client.routing.neverProxySubnets` now preserve the matching default route
gateway and source address.

Previously, routed environments such as virtual machines could receive
unusable on-link routes for destinations that were supposed to remain outside
the Telepresence tunnel. With 2.28, those destinations keep using the
workstation's normal route.

### Also-proxy traffic goes through the Traffic Manager

Addresses covered by `--also-proxy` or
`client.routing.alsoProxySubnets` now use the traffic-manager tunnel unless
the destination was explicitly translated by `--proxy-via`.

That prevents arbitrary also-proxy traffic from being sent through an unrelated
traffic-agent just because mapped namespaces or active intercepts make an agent
available. The result is less surprising routing, especially in sessions that
combine broad cluster access with one or more active engagements.

Read more in the [`alsoProxySubnets` configuration
reference](/docs/reference/config#alsoproxysubnets).

---

## Traffic-Agent Injection Improvements

This release also improves how injected traffic-agents participate in pod
networking.

Init containers now build owner-based iptables exclusions from the
traffic-agent container's configured `runAsUser` when available. This avoids a
case where application containers running as the same user as the init
container could bypass mesh or traffic-agent routing rules.

Injected init containers also route pod-IP output traffic through the same
iptables chains used for loopback traffic. That helps service mesh sidecars and
traffic-agent forwarding paths reach the expected redirect and DNAT rules even
when they connect to the application through the pod IP.

Traffic-agent configs now prefer a fully-qualified traffic-manager service DNS
name when the cluster domain is known. This avoids depending on workload DNS
search paths to find the manager service from another namespace, while keeping
the existing short-name fallback.

Finally, traffic-agents now recognize common cleartext HTTP/1 Kubernetes
Service `appProtocol` values such as `http` and `kubernetes.io/http`. Known
HTTP/1 services no longer need unnecessary TLS and HTTP/2 probing, avoiding
latency when those probes cannot connect through an inactive proxy port.

---

## Better Long-Running Session Reliability

Telepresence 2.28 contains several fixes for keeping sessions healthy when
daemons reconnect, workloads are bursty, or authentication helpers run on
dual-stack hosts.

### Root daemon reconnects

The user daemon now reconnects to the root daemon when the root daemon's
activity watcher fails. Telepresence reuses the saved network configuration,
clears stale DNS routing state, swaps in a fresh root daemon client, and
re-posts DNS domains after reconnecting.

This avoids sessions getting stuck until the user manually reconnects.

### Systemd path includes /usr/sbin

The root daemon systemd service now includes `/usr/sbin` in its `PATH`, so
tools such as `iptables` can be found reliably on Linux installations.

### Kubeauth uses loopback for local daemon access

When the user daemon listens on an unspecified address, such as `[::]:PORT`,
the patched kubeconfig now normalizes the embedded `telepresence kubeauth`
exec-stub target to the matching loopback address.

That fixes broken-pipe failures on macOS with exec-based authenticators such
as `kubelogin`.

### Traffic-agent reconnects clear stale intercepts

When the traffic-manager restarts, reconnecting traffic-agents now clear their
local intercept snapshot before accepting the new manager state. This prevents
stale intercept entries from causing tunnel failures or silently dropped
connections after a manager restart.

### Bounded intercept dial responders

Selected-intercept dial responders are now capped so bursty workloads cannot
make the client daemon fan out unbounded goroutines and gRPC tunnels. VIF
setup failure paths are also safer during cleanup on Linux.

---

## Get Started

Upgrade to Telepresence 2.28.0 if you work across multiple namespaces, rely on
explicit routing configuration, or keep development sessions running for long
periods.

Check out the [install guide](/docs/install/client) for platform-specific
instructions and the full [release notes](/docs/release-notes) for every fix
included in this release.

We'd love your feedback. Open an issue on
[GitHub](https://github.com/telepresenceio/telepresence/issues) or join the
conversation in [GitHub Discussions](https://github.com/telepresenceio/telepresence/discussions).
