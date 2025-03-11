---
title: Using Docker for intercepts
description: How a Telepresence intercept can run a Docker container with configured environment and volume mounts.
toc_min_heading_level: 2
toc_max_heading_level: 2
---

# Using Docker when engaging with workloads

## Using command flags

### The docker flag
You can start the Telepresence daemon in a Docker container on your laptop using the command:

```console
$ telepresence connect --docker
```

### The telepresence curl command

The network interface that is added when connecting using `telepresence connect --docker` will not be accessible directly from the host computer. It is confined to the telepresence daemon container, and there you should not expect to be able to curl your cluster resources directly.

You can use the `telepresence curl` command to curl your cluster resources. This command will run curl in a docker container that shares the network of the daemon container.

### The telepresence docker-run command

The `telepresence docker-run` command will start a container that automatically shares the daemon container network. It
will also circumvent Docker limitations that prevent containers that share another container's network to also make
ports available using `--publish`, `--expose`, or adding additional networks using `--network`.

To achieve this, Telepresence temporarily adds the necessary network to the containerized daemon. This allows the new
container to join the  same network. Additionally, Telepresence starts extra socat containers to handle port mappings,
ensuring that the desired ports are exposed to the local environment.

> [!NOTE]
> If you use `telepresence docker-run` to run a command that lasts longer than the `telepresence connect --docker` that
> was in effect when it started, then it will lose its network. In other words, when using `telepresence docker-run`,
> you must always rerun after a `telepresence quit`/`telepresence connect --docker`.

### The replace/ingest/intercept --docker-run flag

If you want your replace, ingest, or intercept to use another Docker container, you can use the `--docker-run` flag. It will establish the engagement,
run your container in the foreground, then automatically end the engagement when the container exits.

After establishing a connection to a cluster using `telepresence connect --docker`, the container started when using `--docker-run` will share
the same network as the containerized daemon that maintains the connection. This enables seamless communication between your local development
environment and the remote cluster.

The `docker run` flags `--network`, `--publish`, or `--expose` are all available, just as with the `docker-run` command.

```console
$ telepresence replace <workload_name> --container <container_name> --docker-run -- <docker run flags> <image> <container arguments>
```
OR
```console
$ telepresence ingest <workload_name> --container <container_name> --docker-run -- <docker run flags> <image> <container arguments>
```
OR
```console
$ telepresence intercept <workload_name> --port <port> --docker-run -- <docker run flags> <image> <container arguments>
```

The `--` separates flags intended for `telepresence replace/ingest/intercept` from flags intended for `docker run`.

It's recommended that you always use the `--docker-run` in combination with a connection started with the `telepresence connect --docker`,
because that makes everything less intrusive:

- No admin user access is needed. Network modifications are confined to a Docker network.
- There's no need for special filesystem mount software like MacFUSE or WinFSP. The volume mounts happen in the Docker engine.

The following happens under the hood when both flags are in use:

- The network of for the replace, ingest, or intercept handler will be set to the same as the network used by the daemon. This guarantees that the
  handler can access the Telepresence VIF, and hence have access the cluster.
- Volume mounts will be automatic and made using the Telemount Docker volume plugin so that all volumes exposed by the targeted
  remote container are mounted on the local handler container.
- The environment of the remote container becomes the environment of the local handler container.

### The docker-build flag

The `--docker-build <docker context>` and the repeatable `docker-build-opt key=value` flags enable container's to be build on the fly by the replace/ingest/intercept command.

When using `--docker-build`, the image name used in the argument list must be verbatim `IMAGE`. The word acts as a placeholder and will be replaced by the ID of the image that is built.

The `--docker-build` flag implies `--docker-run`.

## Using docker-run flag without docker

It is possible to use `--docker-run` with a daemon running on your host, which is the default behavior of Telepresence. 

However, it isn't recommended since you'll be in a hybrid mode: while your handler runs in a container, the daemon will modify the host network, and if remote mounts are desired, they may require extra software. 

The ability to use this special combination is retained for backward compatibility reasons. It might be removed in a future release of Telepresence.

The `--port` flag has slightly different semantics and can be used in situations when the local and container port must be different. This
is done using `--port <local port>:<container port>`. The container port will default to the local port when using the `--port <port>` syntax.

## Examples

Imagine you are working on a new version of your frontend service.  It is running in your cluster as a Deployment called `frontend-v1`. You use Docker on your laptop to build an improved version of the container called `frontend-v2`.  To test it out, use this command to run the new container on your laptop and start an intercept of the cluster service to your local container.

```console
$ telepresence connect --docker
$ telepresence replace frontend-v1 --docker-run -- frontend-v2
```

Now, imagine that the `frontend-v2` image is built by a `Dockerfile` that resides in the directory `images/frontend-v2`. You can build and replace directly.

```console
$ telepresence replace frontend-v1 --docker-build images/frontend-v2 --docker-build-opt tag=mytag -- IMAGE
```

## Automatic flags

Telepresence will automatically pass some relevant flags to Docker to connect the container with the remote container. Those flags are combined with the arguments given after `--` on the command line.

- `--env-file <file>` Loads the remote environment
- `--name intercept-<intercept name>-<intercept port>` Names the Docker container, this flag is omitted if explicitly given on the command line
- `-v <local mount dir:docker mount dir>` Volume mount specification, see CLI help for `--docker-mount` flags for more info

When used with a container based daemon:
- `--rm` Mandatory, because the volume mounts cannot be removed until the container is removed.
- `-v <telemount volume>:<docker mount dir>` Volume mount specifications propagated from the engaged container
- `--network container:<name of containerized daemon>` Network is shared with the containerized daemon

When used with a daemon that isn't container based:
- `--dns-search tel2-search` Enables single label name lookups in the connected namespace
- `-p <port:container-port>` The local port for the intercept and the container port
