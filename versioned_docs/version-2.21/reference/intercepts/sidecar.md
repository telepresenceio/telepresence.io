---
title: Traffic Agent Sidecar
---
# Traffic Agent Sidecar

When intercepting a service, the Telepresence Traffic Manager ensures
that a Traffic Agent has been injected into the intercepted workload.
The injection is triggered by a Kubernetes Mutating Webhook and will
only happen once. The Traffic Agent is responsible for redirecting
intercepted traffic to the developer's workstation.

The intercept will intercept all `tcp` and/or `udp` traffic to the
intercepted service and send all of that traffic down to the developer's
workstation. This means that an intercept will affect all users of
the intercepted service.

## Supported workloads

Kubernetes has various
[workloads](https://kubernetes.io/docs/concepts/workloads/).
Currently, Telepresence supports installing a
Traffic Agent container on `Deployments`, `ReplicaSets`, `StatefulSets`, and `ArgoRollouts`. A Traffic Agent is
installed the first time a user makes a `telepresence ingest WORKLOAD`, `telepresence intercept WORKLOAD`, or a
`telepresence connect --proxy-via CIDR=WORKLAOD`.

A Traffic Agent may also be installed up front by adding a `telepresence.getambassador.io/inject-traffic-agent: enabled`
annotation to the WORKLOADS pod template.

### Sidecar injection

The actual installation of the Traffic Agent is performed by a mutating admission webhook that calls the agent-injector
service in the Traffic Manager's namespace.

The configuration for the sidecar, which is automatically generated, resides in the configmap `telepresence-agents`.

### Uninstalling the Traffic Agent

A Traffic Agent will normally remain in the workload's pods once it has been installed. It can be explicitly removed by
issuing the command `telepresence uninstall WORKLOAD`. It will also be removed if its configuration is removed
from the `telepresence-agents` configmap.

Removing the `telepresence-agents` configmap will effectively uninstall all injected Traffic Agents from the same
namespace.

> [!NOTE]
> Uninstalling will not work if the Traffic Agent is installed using the pod template annotation.

### Disable Traffic Agent in a workload

The Traffic Agent installation can be completely disabled by adding a `telepresence.getambassador.io/inject-traffic-agent: disabled`
annotation to the WORKLOADS pod template. This will prevent all attempts to do anything with the workload that will
require a Traffic Agent.

### Disable workloads

By default, traffic-manager will observe `Deployments`, `ReplicaSets` and `StatefulSets`.
Each workload used today adds certain overhead. If you are not intercepting a specific workload type, you can disable it to reduce that overhead.
That can be achieved by setting the Helm chart values `workloads.<workloadType>.enabled=false` when installing the traffic-manager.
The following are the Helm chart values to disable the workload types:

- `workloads.deployments.enabled=false` for `Deployments`,
- `workloads.replicaSets.enabled=false` for `ReplicaSets`,
- `workloads.statefulSets.enabled=false` for `StatefulSets`.

### Enable ArgoRollouts

In order to use `ArgoRollouts`, you must pass the Helm chart value `workloads.argoRollouts.enabled=true` when installing the traffic-manager.
It is recommended to set the pod template annotation `telepresence.getambassador.io/inject-traffic-agent: enabled` to avoid creation of unwanted
revisions.

> [!NOTE]
> While many of our examples use Deployments, they would also work on other supported workload types.
