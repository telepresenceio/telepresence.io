---
title: Architecture
description: How Telepresence works to intercept traffic from your Kubernetes cluster to code running on your laptop.
hide_table_of_contents: true
---

# Telepresence Architecture

![Architecture](../images/TP_Architecture.svg)

## Telepresence CLI

The Telepresence CLI orchestrates the moving parts on the workstation: it starts the Telepresence Daemons and then acts
as a user-friendly interface to the Telepresence User Daemon.

## Telepresence Daemons
Telepresence has Daemons that run on a developer's workstation and act as the main point of communication to the cluster's
network in order to communicate with the cluster and handle intercepted traffic.

### User-Daemon
The User-Daemon coordinates the creation and deletion of ingests and intercepts by communicating with the [Traffic Manager](#traffic-manager).
All requests from and to the cluster go through this Daemon.

### Root-Daemon
The Root-Daemon manages the networking necessary to handle traffic between the local workstation and the cluster by setting up a
[Virtual Network Device](tun-device.md) (VIF). For a detailed description of how the VIF manages traffic and why it is necessary
please refer to this blog post:
[Implementing Telepresence Networking with a TUN Device](https://blog.getambassador.io/implementing-telepresence-networking-with-a-tun-device-a23a786d51e9).

## Traffic Manager

The Traffic Manager is the central point of communication between Traffic Agents in the cluster and Telepresence Daemons
on developer workstations. It is responsible for injecting the Traffic Agent sidecar into ingested or intercepted pods,
proxying all relevant inbound and outbound traffic, and tracking active intercepts.

The Traffic-Manager is installed by a cluster administrator. It can either be installed using the Helm chart embedded
in the telepresence client binary (`telepresence helm install`) or by using a Helm Chart directly.

## Traffic Agent

The Traffic Agent is a sidecar container that facilitates ingests and intercepts. When an ingest or intercept is first
started, the Traffic Agent container is injected into the workload's pod(s). You can see the Traffic Agent's status by
running `telepresence list` or `kubectl describe pod <pod-name>`.

Depending on if an intercept is active or not, the Traffic Agent will either route the incoming request  to a 
your workstation, or it will pass it along to the container in the pod usually handling requests on that port.

Please see [Traffic Agent Sidecar](intercepts/sidecar.md) for details.