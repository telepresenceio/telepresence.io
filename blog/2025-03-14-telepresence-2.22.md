---
title: Telepresence 2.22
description: What's new in Telepresence 2.22.
slug: telepresence-2.22
authors: thallgren
---

Telepresence 2.22 introduces several compelling features, notably the telepresence replace command, a JSON schema for Helm chart values, greater control over Traffic Manager's namespace scope, and improved customization of remote mount behavior.

<!-- truncate -->

## Telepresence Replace: Container-Level Substitution

Telepresence introduces `telepresence replace`, a new command that offers a distinct method for interacting with containers, complementing `telepresence intercept` and `telepresence ingest`.

### Distinguishing Features of `replace`

While superficially similar to `intercept`, `replace` operates with fundamental differences:

1.  **Container-Wide Scope:** `replace` substitutes an entire container, redirecting all its traffic, whereas `intercept` focuses on specific services or service/container ports.
2.  **Direct Container Port Mapping:** The `--port` flag in `replace` directly maps to container ports.
3.  **Optional Port Interception:** Unlike `intercept`, `replace` can function without intercepting any specific ports.
4.  **Complete Container Replacement:** During a `replace`, the original container within the cluster is deactivated and fully substituted.

### Rationale: Addressing Container-Level Substitution Needs

The existing `telepresence intercept --replace` flag, which targets specific ports, prompted the development of the dedicated `replace` command.

`intercept` inherently focuses on port-level traffic redirection. However, scenarios arise where container-level substitution is required without specific port interception. For instance, a message-queue consumer container might not expose any ports. Introducing a `--no-ports` flag to `intercept --replace` would create a logical contradiction, as "intercept" implies port-based traffic redirection.

Therefore, `replace` was introduced to provide a clear and consistent mechanism for container-level substitution.

### Deprecation of the `--replace` flag
The `telepresence intercept --replace` flag is now deprecated. While it remains functional, a warning will be issued, recommending the use of `telepresence replace` instead.

### Generic term for Ingest, Intercept, and Replace

Client engagement of a container is defined as the act of ingesting, intercepting, or replacing that container. Consequently, the term 'engage' will appear frequently throughout the documentation.

## Traffic Manager Namespaces

The namespaces that the Telepresence Traffic Manager cares about can be declared in the Helm chart, and multiple  Traffic Managers can be installed that deal with their own set of namespaces as long as there's no overlap. This has been the case before this release. Two things are new though:

1. **Namespaces are consistently declared:** Prior to this release, the namespace declaration was scattered into several Helm chart values, such as `manager.Rbac.namespaces`, `client.Rbac.namespaces`, and `agentInjector.webhook.namespaceSelector`. The definition is now unified to the mutual exclusive top-level Helm chart values `namespaces` and `namespaceSelector`.
2. **The conflict detection is all-encompassing**: The old way of declaring namespaces implied that the Traffic Manager was either "cluster wide" (no declaration existed) or "namespaced". A conflict would be detected between two "namespaced" installation, but not between a "namespaced" and a "cluster wide" installation. This is no longer the case. All conflicting namespace selectors will yield errors and Helm will refuse to install them.

### Dynamic or Static Selector

A namespace selector can be dynamic or static. Telepresence will consider a selector that just targets the namespace name as a _static_ selector. Selectors using other labels, or negation of labels (using operator `NotIn`) are considered _dynamic_. The Difference is that the former isn't sensitive to changes (except, of course, the removal of a namespace) whereas the latter will take effect immediately if the set of matching namespaces changes.

Sample _static_ selector, selecting the namespaces "alpha" and "beta":
```yaml
namespaceSelector:
  matchExpressions:
  - key: kubernetes.io/metadata.name
    operator: In
    values:
    - alpha
    - beta
```

This type of selector can also be declared using the short form `namespaces`:
```yaml
namespaces:
- alpha
- beta
```

Sample _dynamic_ selector, selecting namespaces where the label "example.com/managed" is "true" and "example.com/environment" is "dev" or "qa":

```yaml
namespaceSelector:
  matchLabels:
    example.com/managed: "true"
  matchExpressions:
  - key: example.com/environment
    operator: In
    values:
    - dev
    - qa
```

## Volume Mount Policies

This feature gives the user control over what volumes that the traffic-agent will share with the client, how those volumes are shared (read-write or read-only), and also give the client a hint about volumes that are not shared but will be expected by the locally running container.

Mount policies can be configured globally for a Traffic Manager using Helm chart values, or individually for a workload using template annotations.

A volume policy can be `Ignore`, `Local`, `Remote`, or `RemoteReadOnly`. See the [Control Volume Sharing](/docs/reference/cluster-config#control-volume-sharing) section in the reference documentation for detailed information on the Helm chart value and annotation.

## JSON-Schema for the Helm Chart Values

It is no longer possible to enter invalid, misspelled, or otherwise non-existent configuration parameters when doing
a `helm install|upgrade` or `telepresence helm install|upgrade`, because all values are now guarded using a JSON-schema.

A new `telepresence helm lint` command was also added, which corresponds to [helm lint](https://helm.sh/docs/helm/helm_lint/), but uses the Helm chart embedded in the `telepresence` binary.

## Other Notable Changes

### Annotation Prefix Change
All annotations now use the prefix `telepresence.io/`. This prefix was already used by labels added by Telepresence. The former annotation prefix `telepresence.getambassador.io/` will continue to work, but a warning will be printed in the logs.

### Configmap `telepresence-agents` is no longer used
The Traffic Agent configurations stored in the `telepresence-agents` configmap are now instead added as pod-annotations. The configmap is no longer used, and can be safely removed.

### Rollbacks Triggered Using Pod Eviction
When the configuration for a pod changes as the result of a client engaging with the pod, the pod will now be evicted in order to trigger the mutating webhook. This vouches for simpler logic and faster response times when engaging and ending an engagement. In earlier releases, Telepresence would instead patch the workload. The workload might still be triggered if the eviction fails due to the pod's disruption policy.

Please check out the [Release Notes](/docs/release-notes) for a full list of all new features, changes, and bug-fixes.