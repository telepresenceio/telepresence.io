# Install with Helm

[Helm](https://helm.sh) is a package manager for Kubernetes that automates the release and management of software on Kubernetes. The Telepresence Traffic Manager can be installed via a Helm chart with a few simple steps.

## Before you begin

The Telepresence Helm chart is hosted by Ambassador Labs and published at `https://www.getambassador.io`.

Start by adding this repo to your Helm client with the following command:

```shell
helm repo add datawire https://www.getambassador.io
```

## Install with Helm

When you run the Helm chart, it installs all the components required for the Telepresence Traffic Manager.

1. If you are installing the Telepresence Traffic Manager **for the first time on your cluster**, create the `ambassador` namespace in your cluster:

   ```shell
   kubectl create namespace ambassador
   ```

2. Install the Telepresenc Traffic Manager with the following command:

   ```shell
   helm install traffic-manager --namespace ambassador datawire/telepresence
   ```

For more details on what the Helm chart installs and what can be configured, take a look at the Helm chart [README](https://github.com/telepresenceio/telepresence/tree/release/v2/charts/telepresence).

### Install into custom namespace

The Helm chart supports being installed into any namespace, not necessarily `ambassador`. Simply pass a different `namespace` argument to `helm install`.
For example, if you wanted to deploy the traffic manager to the `staging` namespace:

```bash
helm install traffic-manager --namespace staging datawire/telepresence
```

Note that users of telepresence will need to configure their kubeconfig to find this installation of the traffic manager:

```yaml
apiVersion: v1
clusters:
- cluster:
    server: https://127.0.0.1
    extensions:
    - name: telepresence.io
      extension:
        manager:
          namespace: staging
  name: example-cluster
```

See [the kubeconfig documentation](../reference/config#manager) for more information.

## RBAC

### Installing a namespace-scoped traffic manager

You might not want the traffic-manager to have permissions across the entire kubernetes cluster, or you might want to be able to install multiple traffic managers per cluster.
In these cases, the traffic manager supports being installed with a namespace scope, allowing cluster administrators to limit the reach of a traffic manager's permissions.
To do this, create a `values.yaml` like the following:

```yaml
managerRbac:
  create: true
  namespaceScoped: true
  namespaces:
  - dev
  - staging
```

This can then be installed via:

```bash
helm install traffic-manager --namespace staging datawire/telepresence -f ./values.yaml
```

#### Namespace scoped user permissions

Optionally, you can also configure user rbac to be scoped to the same namespaces as the manager itself.
To do this, add the following to `values.yaml`:

```yaml
clientRbac:
  create: true

  # These are the users or groups to which the user rbac will be bound.
  # This MUST be set.
  subjects: {}
  # - kind: User
  #   name: jane
  #   apiGroup: rbac.authorization.k8s.io

  namespaced: true

  namespaces:
  - dev
  - staging
```

#### Namespace-scoped webhook

If you wish to use the traffic-manager's [mutating webhook](../reference/cluster-config#mutating-webhook) with a namespace-scoped traffic manager, you will have to ensure that each namespace has an `app.kubernetes.io/name` label that is identical to its name:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: staging
  labels:
    app.kubernetes.io/name: staging
```

**NOTE** This happens automatically in kubernetes >= 1.21.

### Installing RBAC only

Telepresence Traffic Manager does require some [RBAC](../../refrence/rbac/) for the traffic-manager itself, as well as for users.
To make it easier for operators to introspect / manage RBAC separately, you can use `rbac.only=true` to
only create the rbac-related objects.
Additionally, you can use `clientRbac.create=true` and `managerRbac.create=true` to toggle which subset(s) of RBAC objects you wish to create.
