---
title: Telepresence 2.23
description: What's new in Telepresence 2.23.
slug: telepresence-2.23
authors: thallgren
---

Telepresence 2.23 delivers key enhancements, including the new `telepresence wiretap` command for mirroring container
traffic to your client and a dedicated network driver plugin for Docker that eliminates the need for client containers
to modify their network model.

<!-- truncate -->

## Telepresence Wiretap: Mirror Container Traffic to Your Client

With Telepresence 2.23, you can now wiretap traffic intended for a workload container. This feature doesn't interfere
with the live traffic; instead, it sends a copy directly to your client. This means you can easily monitor and debug how
a service behaves when it receives messages. Any replies from your client are automatically discarded, ensuring no
impact on the remote service. This read-only capability makes it ideal for developing and testing RESTful services
without disruption. Plus, since the wiretap is non-intrusive, there's no limit to how many clients can simultaneously
wiretap the same container.

The `telepresence wiretap` command accepts the same flags as `telepresence intercept`, except the `to-pod` flag. Mounts
are always read-only.

More details can be found in the [Wiretap section](/docs/howtos/engage#wiretap) in our documentation.

## Introducing the Teleroute Docker Network Plugin

Say goodbye to complex network configurations for your Docker containers! With **Telepresence 2.23**, the new
**Teleroute Docker Network Plugin** revolutionizes how your local Docker containers interact with your remote cluster.
This plugin transforms the network established by a `telepresence connect --docker` command into a full-fledged Docker
network, identifiable by your connection's name.

This means any other Docker container can now effortlessly access your cluster resources by simply specifying `--network
<connection name>`. This is a massive improvement over the prior method, which required containers to adopt a cumbersome
`--network container:<name of daemon container>` mode. That old approach often necessitated workarounds like socat
containers for port mappings or the relocation of network configurations to the daemon container itself. The Teleroute
Docker Network Plugin eliminates this complexity, providing a direct and intuitive connection to the network bridge
managed by the Telepresence daemon.

The Teleroute network plugin is designed for seamless integration. It will be installed automatically the first time you
execute `telepresence connect --docker`. For users in air-gapped environments, the docker.teleroute client configuration
offers control over how the necessary image is pulled.

For more in-depth information, please refer to the
[Teleroute Nework Plugin section](/docs/reference/plugins#teleroute-network-plugin) in our documentation.
