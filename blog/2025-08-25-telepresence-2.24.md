---
title: Telepresence 2.24
description: What's new in Telepresence 2.24.
slug: telepresence-2.24
authors: thallgren
---

Discover the latest in Telepresence 2.24 with new Docker Compose extensions, seamlessly bridging local development with Kubernetes clusters. Learn how to proxy remote services, replace cluster containers with local code, and enhance your workflow using our demo. Dive into the how-to guide and reference docs to get started!

<!-- truncate -->

## Announcing Telepresence Docker Compose Extensions

In today's fast-paced world of cloud-native development, bridging the gap between local environments and remote Kubernetes clusters has never been more crucial. Developers often rely on Docker Compose for quick local setups, but integrating those with production-like Kubernetes services can be a hassle—until now. We're thrilled to announce the release of Telepresence version 2.24, featuring powerful new Docker Compose extensions that let you mirror and interact with Kubernetes services right from your local Compose files.

This update empowers you to use familiar `docker compose` workflows while tapping into the full power of Telepresence's cluster connectivity. Whether you're proxying remote services locally or replacing cluster containers with your local code, these extensions streamline debugging, testing, and iteration with minimal disruption to your cluster.

### What Are Telepresence Docker Compose Extensions?

At the heart of this feature is the `x-tele` extension, which you can add to your `compose.yaml` or `compose.override.yaml` files. Telepresence processes these extensions via the new `telepresence compose` command, which acts as an enhanced drop-in replacement for `docker compose`. It handles connections to your Kubernetes cluster, modifies networks, mounts, and environments as needed, and passes a refined spec back to Docker Compose.

The extensions come in two flavors:

#### The Top-Level Extension
Defines a global configuration with cluster connections and volume mount policies. For example:
- **Connections**: Specify namespaces, subnets, and more to link your local setup to the cluster.
- **Mounts**: Control how volumes are handled during engagements (e.g., local, remote, or read-only).

#### Service-Level Extensions
Applied per service, these dictate how your local Docker Compose services interact with remote Kubernetes ones. Supported types include:

| Type      | Behavior                                                                 | Similar CLI Command      |
|-----------|--------------------------------------------------------------------------|--------------------------|
| connect  | Gives the service access to cluster DNS and routing.                     | `telepresence connect`   |
| proxy    | Replaces the local service with a proxy to a remote cluster service.     | N/A                      |
| wiretap  | Receives mirrored traffic from a remote service for observation.         | `telepresence wiretap`   |
| ingest   | Shares environment and volumes from a remote container.                  | `telepresence ingest`    |
| intercept| Handles intercepted traffic from a remote service, with env/vol sharing. | `telepresence intercept` |
| replace  | Fully replaces a remote container with your local service.               | `telepresence replace`   |

All service extensions imply a `connect`.

### Hands-On: Getting Started with Emojivoto

To illustrate the power of these extensions, let's dive into a practical example using the Emojivoto app — a fun, emoji-voting microservices demo, originally developed by Buoyant.io, from our GitHub repo. This mirrors a common scenario: running some services locally while integrating with others in Kubernetes.

#### Setup
1. Clone the repo: `git clone https://github.com/telepresenceio/emojivoto.git`
2. Run locally: `cd emojivoto && docker compose up` (access at http://localhost:8080)
3. Deploy to Kubernetes: `kubectl apply -k kustomize/deployment`
4. Verify pods: `kubectl -n emojivoto get pod`

### Example 1: Proxy a Remote Service Locally
Suppose you don't want to run the "voting" service locally—instead, proxy it from the cluster. Add this to `compose.override.yaml`:

```
x-tele:
  connections:
    - namespace: emojivoto
services:
  voting:
    x-tele:
      type: proxy
```

Run `telepresence compose up`. Your local setup now interacts with the remote "voting" service seamlessly. The vote-bot keeps voting, but logs show "Proxied service voting" with no local output from voting itself.

**Takeaway**: This lets your Compose services consume remote cluster resources without running everything locally, perfect for dependency-heavy apps.

#### Example 2: Replace Remote Services with Local Ones
Flip the script: Make remote services use your local "emoji" and "voting" implementations.

Update `compose.override.yaml`:

```
x-tele:
  connections:
    - namespace: emojivoto
services:
  emoji:
    x-tele:
      type: replace
  voting:
    x-tele:
      type: replace
  vote-bot:
    profiles:
      - notEnabled  # Optional: Disable local vote-bot
```

With `telepresence compose up`, remote pods for "emoji" and "voting" are replaced by traffic-agents redirecting to your local containers. Votes sync from the cluster (thanks to automatic remote mounts), and http://localhost:8080 shows the same leaderboard as the remote app.

To tweak mounts (e.g., use local volumes):

```
x-tele:
  connections:
    - namespace: emojivoto
  mounts:
    - volume: data
      policy: local
```

**Takeaway**: Ideal for hot-swapping code in production-like environments without redeploys, accelerating debugging and feature development.

For more details on fields like ports, workloads, or multi-connection setups, check the full reference.

### Why This Changes Local Development
- **Efficiency**: No more manual intercepts or proxies — define everything in your Compose file.
- **Consistency**: Mirror Kubernetes services locally for accurate testing.
- **Flexibility**: Handle complex scenarios like volume syncing or port mappings effortlessly.
- **Minimal Cluster Disruption**: Engagements are temporary and reversible with `telepresence compose down`.

Whether you're a solo dev or part of a large team, these extensions make Telepresence even more indispensable for Kubernetes workflows.

## Other Significant Improvements

For a full list of changes, see the [release notes](../docs/release-notes).

### Automatic Traffic-Agent Removal

The Helm Chart `agent.maxIdleTime` value was added that controls how long the traffic-agent sidecar can be idle before it is removed from the pod. This is useful for reducing the number of containers running in the cluster.

### Start Browser on a Cluster Service
A new `telepresence serve <service>` command was added that starts a web browser on the specified service. The command is especially useful when used in combination with `telepresence connect --docker` because it will then expose the given service on a random port on localhost.

### Drop the Client Label in Prometheus Metrics

The Helm Chart now has a `prometheus.dropClientLabel` value that can be set to true to drop the client label from the prometheus metrics. This is useful for GDPR compliance, as the client label contains personal data, which can be potentially problematic, i.e. allowing the ability to track the working times of an individual.

### Prefix Prometheus Metrics with "telepresence_"

Avoids metric conflicts and makes these more explicit to improve search in observability stacks.

### Complete CLI reference

The documentation now includes a complete man-page style reference for the `telepresence` command. Check out the [CLI reference](../docs/reference/cli/telepresence) for details on all the commands and options.

## Try It Out Today
Head over to our [how-to guide](../docs/howtos/docker-compose) for the full walkthrough, or dive into the [reference docs](../docs/reference/compose) for specs. [Install](../docs/install/client) Telepresence 2.24 and give Emojivoto a spin—we'd love your feedback on GitHub!

Stay tuned for more updates, and happy coding! 🚀
