import Alert from '@material-ui/lab/Alert';

# Manually injecting the Traffic Agent

It is possible to directly modify your workload's YAML configuration to add the Telepresence Traffic Agent and enable it to be intercepted.

<Alert severity="warning">
This is not the recommended approach for making a workload interceptable, but is sometimes the only possible approach.
Before you manually add the traffic agent into your workloads, it is suggested that you try the <a href="../../cluster-config#mutating-webhook">mutating webhook</a>
</Alert>

## Procedure

For this example we will use the following deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "my-service"
  labels:
    service: my-service
spec:
  replicas: 1
  selector:
    matchLabels:
      service: my-service
  template:
    metadata:
      labels:
        service: my-service
    spec:
      containers:
        - name: echo-container
          image: jmalloc/echo-server
          ports:
            - containerPort: 8080
          resources: {}
```

That is being exposed by the following service:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: "my-service"
spec:
  type: ClusterIP
  selector:
    service: my-service
  ports:
    - port: 80
      targetPort: 8080
```

<Alert severity="info">
This example uses a Deployment but you can also manually inject the agent into StatefulSets or ReplicaSets
</Alert>

### 1. Generating the yaml

The first thing to do is generate YAML for the traffic-agent container:

```console
$ telepresence genyaml container --container-name echo-container --port 8080 --output - --input deployment.yaml
args:
- agent
env:
- name: TELEPRESENCE_CONTAINER
  value: echo-container
- name: _TEL_AGENT_LOG_LEVEL
  value: info
- name: _TEL_AGENT_NAME
  value: my-service
- name: _TEL_AGENT_NAMESPACE
  valueFrom:
    fieldRef:
      fieldPath: metadata.namespace
- name: _TEL_AGENT_POD_IP
  valueFrom:
    fieldRef:
      fieldPath: status.podIP
- name: _TEL_AGENT_APP_PORT
  value: "8080"
- name: _TEL_AGENT_AGENT_PORT
  value: "9900"
- name: _TEL_AGENT_MANAGER_HOST
  value: traffic-manager.ambassador
image: docker.io/datawire/tel2:2.4.6
name: traffic-agent
ports:
- containerPort: 9900
  protocol: TCP
readinessProbe:
  exec:
    command:
    - /bin/stat
    - /tmp/agent/ready
resources: {}
volumeMounts:
- mountPath: /tel_pod_info
  name: traffic-annotations
```

And for the volume:

```console
$ telepresence genyaml volume --output - --input deployment.yaml
downwardAPI:
  items:
  - fieldRef:
      fieldPath: metadata.annotations
    path: annotations
name: traffic-annotations
```

<Alert severity="info">
Try telepresence genyaml container --help or telepresence genyaml volume --help for the meaning of these flags.
</Alert>

### 2. Injecting the YAML into the Deployment

Now, the `Deployment` YAML needs to be modified to include the container and volume; these will be placed as elements of `spec.template.spec.containers` and `spec.template.spec.volumes` respectively.
In addition, `spec.template.metadata.annotations` will have to be modified to add a new annotation, `telepresence.getambassador.io/manually-injected: "true"`
For our example, the end result will look like the following:

```diff
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "my-service"
  labels:
    service: my-service
spec:
  replicas: 1
  selector:
    matchLabels:
      service: my-service
  template:
    metadata:
      labels:
        service: my-service
+     annotations:
+       telepresence.getambassador.io/manually-injected: "true"
    spec:
      containers:
        - name: echo-container
          image: jmalloc/echo-server
          ports:
            - containerPort: 8080
          resources: {}
+       - args:
+         - agent
+         env:
+         - name: TELEPRESENCE_CONTAINER
+           value: echo-container
+         - name: _TEL_AGENT_LOG_LEVEL
+           value: info
+         - name: _TEL_AGENT_NAME
+           value: my-service
+         - name: _TEL_AGENT_NAMESPACE
+           valueFrom:
+             fieldRef:
+               fieldPath: metadata.namespace
+         - name: _TEL_AGENT_POD_IP
+           valueFrom:
+             fieldRef:
+               fieldPath: status.podIP
+         - name: _TEL_AGENT_APP_PORT
+           value: "8080"
+         - name: _TEL_AGENT_AGENT_PORT
+           value: "9900"
+         - name: _TEL_AGENT_MANAGER_HOST
+           value: traffic-manager.ambassador
+         image: docker.io/datawire/tel2:2.4.6
+         name: traffic-agent
+         ports:
+         - containerPort: 9900
+           protocol: TCP
+         readinessProbe:
+           exec:
+             command:
+             - /bin/stat
+             - /tmp/agent/ready
+         resources: {}
+         volumeMounts:
+         - mountPath: /tel_pod_info
+           name: traffic-annotations
+     volumes:
+       - downwardAPI:
+           items:
+           - fieldRef:
+               fieldPath: metadata.annotations
+             path: annotations
+         name: traffic-annotations
```

### 3. Modifying the service

Lastly, once the modified deployment has been applied, you will have to modify the Service to route traffic to the Traffic Agent.
You can do this by changing the exposed `targetPort` to `9900`. The resulting service should look like:

```diff
apiVersion: v1
kind: Service
metadata:
  name: "my-service"
spec:
  type: ClusterIP
  selector:
    service: my-service
  ports:
    - port: 80
-     targetPort: 8080
+     targetPort: 9900
```
