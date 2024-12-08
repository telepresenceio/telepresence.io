---
title: Code and debug an application locally
description: Start using Telepresence in your own environment. Follow these steps to work locally with cluster applications.
hide_table_of_contents: true
---

# Code and debug an application locally

Telepresence allows you to code and debug an application locally, while giving it access to resources in a remote cluster. You can either
do an _ingest_, to gain read-only access to a service, or an _intercept_, to provide read-write access to a service and also re-route
traffic intended for it to your workstation.

## Prerequisites

Before you begin, you need to have [Telepresence installed](../install/client.md). This document uses the Kubernetes command-line tool, [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
in several examples. OpenShift users can substitute oc [commands instead](https://docs.openshift.com/container-platform/4.1/cli_reference/developer-cli-commands.html).

This guide assumes you have an application represented by a Kubernetes deployment and service accessible publicly by an ingress controller,
and that you can run a copy of that application on your laptop.

## Intercept your application

### Running everything directly on the workstation

This approach offers the benefit of direct cluster connectivity from your workstation, simplifying debugging and
modification of your application within its familiar environment. However, it requires root access to configure
network telepresence, and remote mounts must be made relative to a specific mount point, which can add complexity.

1. Connect to your cluster with `telepresence connect` and try to curl to the Kubernetes API server. A 401 or 403 response code is expected and indicates that the service could be reached:

   ```console
   $ curl -ik https://kubernetes.default
   HTTP/1.1 401 Unauthorized
   Cache-Control: no-cache, private
   Content-Type: application/json
   ...
   ```

   You now have access to your remote Kubernetes API server as if you were on the same network. You can now use any local tools to connect to any service in the cluster.

2. Enter `telepresence list` and make sure the workload (deployment in this case) you want to intercept is listed. For example:

   ```console
   $ telepresence list
   ...
   example-app: ready to intercept (traffic-agent not yet installed)
   ...
   ```

3. Get the name of the port you want to intercept on your service:
   `kubectl get service &lt;service name&gt; --output yaml`.

   If we assume that the service and deployment use the same name:

   ```console
   $ kubectl get service example-app --output yaml
   ...
     ports:
     - name: http
       port: 80
       protocol: TCP
       targetPort: http
   ...
   ```

4. Intercept all traffic going to the application in your cluster:
    ```
    telepresence intercept &lt;workload-name&gt; --port [&lt;local-port&gt;][:&lt;remote-port&gt;] --env-file &lt;path-to-env-file&gt;`.
    ```

   * For `--port`: specify the port the local instance of your application is running on. If the intercepted service exposes multiple ports, specify the port you want to intercept after a colon.
   * For `--env-file`: specify a file path for Telepresence to write the environment variables that are set for the intercepted container.

   The example below shows Telepresence intercepting traffic going to deployment `example-app`. Requests to the service on port `http` in the cluster get routed to `8080` on the workstation and the environment variables of the service are written to `~/example-app-intercept.env`.

    ```console
    $ telepresence intercept example-app --port 8080:http --env-file ~/example-app-intercept.env
    Using Deployment example-app
    intercepted
      Intercept name: example-app
      State         : ACTIVE
      Workload kind : Deployment
      Destination   : 127.0.0.1:8080
      Intercepting  : all TCP connections
    ```

5. &lt;a name="start-local-instance"&gt;&lt;/a&gt;Start your local application using the environment variables retrieved in the previous step.
   The following are some examples of how to pass the environment variables to your local process:
   * **Visual Studio Code:** specify the path to the environment variables file in the `envFile` field of your configuration.
   * **JetBrains IDE (IntelliJ, WebStorm, PyCharm, GoLand, etc.):** use the [EnvFile plugin](https://plugins.jetbrains.com/plugin/7861-envfile).

6. Query the cluster in which you intercepted an application and verify your local instance being invoked.
   All the traffic previously routed to your Kubernetes Service is now routed to your local environment

You can now:
- Make changes on the fly and see them reflected when interacting with
  your Kubernetes environment.
- Query services only exposed in your cluster's network.
- Set breakpoints in your IDE to investigate bugs.

### Running everything using Docker

This approach eliminates the need for root access and confines the Telepresence network interface to a container.
Additionally, it allows for precise replication of the target container's volume mounts, using identical mount points.
However, this method sacrifices direct cluster connectivity from the workstation and the containerized environment can
present challenges in terms of toolchain integration, debugging, and the overall development workflow.


1. Connect to your cluster with `telepresence connect --docker` and try to curl the Kubernetes API server from a container. A 401 or 403 response code is expected and indicates that the service could be reached. The `telepresence curl` command used here is the same as `curl` but uses a container initiated with the network created by the Telepresence daemon:

   ```console
   $ telepresence curl -ik https://kubernetes.default
   HTTP/1.1 401 Unauthorized
   Cache-Control: no-cache, private
   Content-Type: application/json
   ...
   ```

   You now have access to your remote Kubernetes API server as if you were on the same network. You can now use any local tools to connect to any service in the cluster.

2. Enter `telepresence list` and make sure the workload (deployment in this case) you want to intercept is listed. For example:

   ```console
   $ telepresence list
   ...
   example-app: ready to intercept (traffic-agent not yet installed)
   ...
   ```

3. Get the name of the port you want to intercept on your service:
   `kubectl get service &lt;service name&gt; --output yaml`.

   If we assume that the service and deployment use the same name:

   ```console
   $ kubectl get service example-app --output yaml
   ...
     ports:
     - name: http
       port: 80
       protocol: TCP
       targetPort: http
   ...
   ```

4. Intercept all traffic going to the application in your cluster, and start a local container to handle that intercept:
    ```
    telepresence intercept &lt;workload-name&gt; --port [&lt;local-port&gt;][:&lt;remote-port&gt;] --docker-run -- &lt;your local container&gt;.
    ```

   * For `--port`: If the intercepted service exposes multiple ports, specify the service port you want to intercept after a colon.
     The local port can be empty to default to the same as the targeted container port.

   The example below shows Telepresence intercepting traffic going to deployment `example-app`. The local container inherits
   the environment and the volume mounts from the targeted container, and requests to the service on port `http` in the
   cluster get routed to the local container and the environment variables of the service are written to `~/example-app-intercept.env`.

    ```console
    $ telepresence intercept example-app --port :http --docker-run -- &lt;your local container&gt;
    Using Deployment example-app
    intercepted
      Intercept name: example-app
      State         : ACTIVE
      Workload kind : Deployment
      Destination   : 127.0.0.1:8080
      Intercepting  : all TCP connections
    &lt;output from your local container&gt;
    ```

5. Query the cluster in which you intercepted an application and verify your local instance being invoked.
   All the traffic previously routed to your Kubernetes Service is now routed to your local container.

You can now:
- Make changes on the fly and see them reflected when interacting with your Kubernetes environment; although
  depending on how your local container is configured, this might require that it is rebuilt.
- Query services only exposed in your cluster's network using `telepresence curl`.
- Set breakpoints in a _Remote Debug_ configuration in your IDE to investigate bugs.

## Ingest your service

In some situations, you want to work and debug the code locally, and you want it to be able to access other services in the cluster,
but you don't wish to intercept any traffic intended for the targeted workload. This is where the `telepresence ingest` command
comes into play. Just like intercept, it will make the environment and mounted containers of the targeted container available locally,
but it will not intercept any traffic.

This example assumes that you have the `example-app`

### Running everything directly on the workstation

1. Connect and run and start an ingest from `example-app`:
    ```console
    $ telepresence connect
    Launching Telepresence User Daemon
    Launching Telepresence Root Daemon
    Connected to context xxx, namespace default (https://&lt;some url&gt;)
    $ telepresence ingest example-app --env-file ~/example-app-intercept.env
    Using Deployment example-app
       Container         : example-app
       Volume Mount Point: /tmp/telfs-166994305
    ```

2. Start your local application using the environment variables retrieved in the previous step.

You can now:
- Code and debug your local app while it interacts with other services in your cluster.
- Query services only exposed in your cluster's network.
- Set breakpoints in your IDE to investigate bugs.

### Running everything using Docker

1. Connect using docker start an ingest from `example-app`, and run a container locally with the ingested environment and volume mounts:
    ```console
    $ telepresence connect --docker
    Launching Telepresence User Daemon
    Connected to context xxx, namespace default (https://&lt;some url&gt;)
    $ telepresence ingest example-app --expose 8080 --docker-run -- &lt;your local container&gt;
    Using Deployment example-app, container example-app
    &lt;output from your local container&gt;
   ```

You can now:
- Code and debug your local container while it interacts with other services in your cluster.
- Send request to your local container using localhost:&lt;local port&gt;
- Query services only exposed in your cluster's network using `telepresence curl`.
- Set breakpoints in a _Remote Debug_ configuration in your IDE to investigate bugs.
