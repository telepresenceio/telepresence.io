---
title: Telepresence 2.29
description: What's new in Telepresence 2.29.
slug: telepresence-2.29
authors: thallgren
---

# Telepresence 2.29.0: Faster Local Intercepts and Deeper Service Mesh Integration

Telepresence 2.29.0 is now available. The headline change makes local
development feel local again: when one intercept handler talks to another
intercepted service, the traffic no longer takes a round trip out to the
cluster and back. This release also brings Telepresence and service meshes
much closer together — Istio `ServiceEntry` hosts now resolve from your
workstation, and an injected traffic-agent no longer lets application traffic
slip past the mesh.

Plenty more landed too: ingress URLs in intercept output, a consistent
`--format` flag for structured output, a way to expose the agent-injector
webhook to clusters whose control plane can't reach it (EKS with Calico), and a
batch of networking, IPv6/dual-stack, and Helm improvements.

<!-- truncate -->

---

## Local Intercepts Skip the Cluster Round Trip

When you run more than one intercept at a time, their handlers often call each
other. Until now, if the handler of one intercept dialed a cluster destination
that was itself covered by another of your active intercepts, the connection
traveled all the way to the cluster only to be routed straight back to a local
handler on your workstation.

In 2.29.0 the root daemon recognizes this case and connects such traffic
**directly to the local handler** — both for the intercepted service's
ClusterIP and for the pod IPs of every pod backing the intercepted workload.
For chatty service-to-service development loops, that removes a noticeable
amount of latency and a pointless trip through the network.

The behavior is enabled by default and controlled with a new client
configuration setting:

```yaml
intercept:
  localShortcut: true          # default: take the local shortcut
  localShortcutIsGlobal: true  # default: shortcut all intercepts
```

The shortcut works at the connection level, so it cannot evaluate header or
path filters. By default it therefore applies to every intercept, on the
assumption that filters exist to limit how an intercept affects *other*
people's traffic — not your own. If you need local traffic to honor your
filters exactly (at the cost of the round trip through the cluster), set
`intercept.localShortcutIsGlobal` to `false`. Wiretaps are never shortcut,
since they receive a *copy* of the traffic rather than the traffic itself.

See the [configuration reference](/docs/reference/config) for details.

---

## Deeper Service Mesh Integration

This release closes several long-standing gaps between Telepresence and service
meshes such as Istio.

### Resolve and reach Istio `ServiceEntry` hosts

Names that only a service mesh can resolve — such as Istio `ServiceEntry` hosts
when Istio's DNS proxying is enabled — can now be used directly from your
workstation. The traffic-agent's DNS lookups are subjected to the mesh's DNS
interception, and a new Helm value lists the address ranges the agent must dial
through the mesh proxy:

```yaml
agent:
  serviceMesh:
    dialSubnets:
      - 240.240.0.0/16   # Istio's ServiceEntry auto-allocation range
```

Engage a meshed workload, or connect with `--proxy-via` through one, and the
`ServiceEntry` host resolves and routes via the mesh — just as it would from
inside the cluster.

### Application traffic no longer bypasses the mesh

The traffic-agent exempts its *own* traffic from mesh processing with an
iptables owner match. Previously that match was based on the agent's UID, which
is inherited from the application container's `securityContext` (or defaults to
root). An application that happened to share that UID had its outbound traffic
silently bypass the mesh sidecar — losing mTLS, telemetry, and policy
enforcement.

The agent container is now assigned a distinct primary group (default `7439`,
overridable with `agent.securityContext.runAsGroup`), and the owner matches are
group-based. Application traffic in an engaged pod always traverses the mesh.

### Agent DNS lookups honor your timeout

The traffic-agent used to impose a hard-coded 250 ms timeout on the DNS lookups
it performs for a connected client. A resolution that needs search-path
expansion — or that passes through a mesh DNS proxy like Istio's — can easily
take longer, producing spurious `NXDOMAIN` answers on the workstation. The
agent now honors the calling client's deadline, governed by the
`dns.lookupTimeout` client setting.

The [Istio how-to](/docs/howtos/istio) walks through a meshed setup end to end.

---

## Clearer Intercept Output

`telepresence intercept` and `telepresence list` now show the **ingress URLs**
through which an intercepted service port can be reached. When the intercept
uses HTTP header filters, the output even includes a ready-to-paste `curl`
example with the matching `-H` flags, so sending a request that routes to your
local handler is copy-and-go.

Alongside that, a new global `--format` flag produces clean, envelope-free
structured output for every command:

```bash
telepresence intercept echo --format json
```

`--format` accepts `json`, `yaml`, and `json-stream`, and emits the command's
object directly. The older `--output` flag still works but is now deprecated in
its favor.

---

## Reaching Clusters That Couldn't Reach the Webhook

On some clusters the Kubernetes API server can't reach an in-cluster Service —
Amazon EKS with the Calico CNI is the classic example, because the control
plane lives outside the pod network. That made the agent-injector mutating
webhook unreachable and intercepts silently never receive their agent.

The Helm chart can now expose the injector independently of the chart-wide
service type, add Subject Alternative Names to the webhook certificate, or point
the webhook at an external URL entirely:

- `agentInjector.service.type` / `agentInjector.service.nodePort`
- `agentInjector.certificate.altNames`
- `agentInjector.webhook.url`

When an agent still doesn't arrive, the traffic-manager now explains that the
API server likely can't reach the webhook and points at the remedies. See the
[EKS/Calico troubleshooting guide](/docs/troubleshooting#eks-calico-and-traffic-agent-injection-timeouts).

---

## More to Explore

A few other improvements worth calling out:

- **Ingest in mapped namespaces** — `telepresence ingest` accepts `--namespace`
  to pick the workload namespace per engagement, mirroring `intercept`,
  `wiretap`, and `replace`. See the
  [engagement CLI reference](/docs/reference/engagements/cli).
- **Helm chart polish** — a chart-wide `labels` value applied to every resource,
  an `agentInjector.webhook.objectSelector` to scope injection to matching pods,
  traffic-manager RBAC generated from your `workloads.*.enabled` settings, and
  clearer diagnostics (with the underlying Kubernetes reason) when the
  traffic-manager pod can't become ready during `helm install`/`upgrade`.
- **Networking and reliability fixes** — correct IPv6 virtual IPs and dual-stack
  routing (including under `--docker`), reachability for pods on a routed
  subnet's network or broadcast address, a local DNS server that stays reachable
  when its IP falls inside a routed subnet, DNS cache flushing when the agent set
  changes, and remote mounts that retry their first connection instead of giving
  up.

---

## Get Started

Upgrade to Telepresence 2.29.0 if you run multiple intercepts at once, work with
a service mesh, or develop against clusters where the control plane sits outside
the pod network.

Check out the [install guide](/docs/install/client) for platform-specific
instructions, and the full [release notes](/docs/release-notes) for every
feature, change, and fix in this release.

We'd love your feedback. Open an issue on
[GitHub](https://github.com/telepresenceio/telepresence/issues) or join the
conversation in the community.
