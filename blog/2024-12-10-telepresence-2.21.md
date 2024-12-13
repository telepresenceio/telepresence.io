---
title: Telepresence 2.21
description: What's new in Telepresence 2.21.
slug: telepresence-2.21
authors:
  - name: Thomas Hallgren
    title: Maintainer of Telepresence OSS
    url: https://github.com/thallgren
    image_url: https://github.com/thallgren.png
    socials:
      linkedin: https://www.linkedin.com/in/thallgren/
---

Telepresence 2.21.0 has been released, and here is a walkthrough of its many new features, such as  automatic VPN
conflict avoidance, the new `telepresence ingest` command, and the improved docker  support provided by commands like
`telepresence curl` and `telepresence docker-run`.

<!-- truncate -->

## No More VPN Conflicts

One of the most common problems for Telepresence users has been that the IP ranges used by the Kubernetes cluster that
they connect to collide with IP ranges provided by other already existing networks on the workstation. Telepresence
would refuse to connect when such a conflict was detected, and require that the user somehow specified how to resolve
it. This is no longer the case. Starting with version 2.21.0, Telepresence will proactively resolve the conflict by
moving the cluster subnets out of the way!

### Virtual Network Address Translation (VNAT)
The process of moving a subnet is fairly simple. The Telepresence DNS resolver will translate IPs returned by the
cluster DNS resolver into an IP range that is guaranteed not to conflict, and the Telepresence Virtual Network
Interface will then translate them back to their original on access.

Telepresence will also ensure that any references to those IPs in the environment that is propagated when using
`telepresence ingest` or `telepresence intercept` are translated as well. A local process using the environment will
hence be able to use those IPs to connect to resources in the cluster.

![VNAT](../static/img/vnat-dark.png#gh-dark-mode-only)![VPN Kubernetes config](../static/img/vnat.png#gh-light-mode-only)

### VNAT Caveats

Telepresence may not accurately detect cluster-side IP addresses being used by services running locally on a workstation
in certain scenarios. This limitation arises when local services obtain IP addresses from remote sources such as
databases or configmaps, or when IP addresses are sent to it in API calls.

Using commands like `nslookup <svc name>` will show different IP addresses than the ones shown when using commands like
`kubernetes get svc <svc name>` if the service subnet is subjected to VNAT translation. The same is true when using
`nslookup <pod name>` and `kubernetes get pod -o wide`.

In situations where VNAT causes problems, it can be disabled. Consult the Technical Reference documentation for more
details on how to do that.

## New Ingest Command

The new ingest command can be thought of as a light version of intercept. It's in many respects the same thing, but
without the traffic.

Sometimes, intercepting network traffic to a container isn't the most efficient solution. For example, if you're working
with a Kafka service that only interacts with a message broker, or if you're planning to send data to your local
application through other means, just accessing the container's environment and volume mounts might be more practical.
The new `telepresence ingest <workload> [--container <container name>]` command was designed for this purpose.

First, `telepresence connect` establishes network access to the cluster. Then, `telepresence ingest` makes the
container's environment and volume mounts available locally, allowing local processes to run, but without receiving
intercepted traffic.

The syntax for the ingest and the intercept command is very similar, but while the intercept will target a port to
intercept (and implicitly a container), the ingest command will target a container directly.

There's no conflict when several ingests of the same container, possibly on different workstations, happen
simultaneously, because volumes are always mounted read-only, and everything happens on the client side.

### Why the term "ingest"?
I initially considered adding a `--no-traffic` option to the `intercept` command. This would allow users to invoke the
command without actually intercepting traffic. However, given that "intercept" inherently implies the act of
intercepting, such an option would be counterintuitive and potentially confusing.

The term "ingest" was [suggested by a user](https://github.com/telepresenceio/telepresence/issues/3713), and it has a
nice ring to it. The local process indeed ingests the remote container's environment and volume mounts.

## Improved Docker Support

The cluster network that Telepresence makes available when connecting using `telepresence connect --docker`, will be
confined to the daemon container, so commands like `curl` or `nslookup` would not find the cluster resources when
executed on the host. To run a curl command, you'd have to do something like:

### telepresence curl

```bash
docker run --network container:<daemon container name> curlimages/curl <name of service>
```

The command `telepresence curl` will run a standard `curl` from a docker image that shares the daemon container's
network, and the above can be replaced with:

```bash
telepresence curl <name of service>
```

### telepresence docker-run

The `telepresence docker-run` will do a `docker run` and attach the daemon network. So a command like:
```bash
docker run --network container:<daemon container name> --rm -it jonlabell/network-tools ip route
```
becomes:
```bash
telepresence docker-run --rm -it jonlabell/network-tools ip route
```

The command will also ensure that port flags like `--publish`, `--expose` works by circumventing a docker network
limitation otherwise preventing this when a container's network is shared. This is achieved using ephemeral socat
containers. The command will also enable adding additional `--network` flags by temporarily adding them to the daemon
container.

The `telpresence intercept/ingest --docker-run` now also leverages this technique.

## Performance Improvements

This release contains several performance improvements. Most notably perhaps the rewrite of the `telepresence list`
command, so that it now retrieves its data from the traffic-manager instead of doing a large number of API calls to
the Kubernetes API. This makes a huge difference when the namespace contains a large number of workloads.

## And there's more

The release contains several other improvements such as Windows arm64 support, and the ability to exclude certain
workload types to offload the traffic-manager. And, of course, a number of bugfixes. For a full list, please review the
[release notes](../../docs/release-notes).
