---
description: "Start using Telepresence in your own environment. Follow these steps to intercept your service in your cluster."
---

import Alert from '@material-ui/lab/Alert';
import Platform from '@src/components/Platform';
import QSCards from '../quick-start/qs-cards'

# Intercept a service in your own environment

Telepresence enables you to create intercepts to a target Kubernetes workload. Once you have created and intercept, you can code and debug your associated service locally. 

For a detailed walk-though on creating intercepts using our sample app, follow the [quick start guide](../../quick-start/demo-node/).


## Prerequisites

Before you begin, you need to have [Telepresence installed](<../../install/), and either the Kubernetes command-line tool, [`kubectl`](https://kubernetes.io/docs/tasks/tools/install-kubectl/), or the OpenShift Container Platform command-line interface, [`oc`](https://docs.openshift.com/container-platform/4.2/cli_reference/openshift_cli/getting-started-cli.html#cli-installing-cli_cli-developer-commands). This document uses kubectl in all example commands. OpenShift users can substitute oc [commands instead](https://docs.openshift.com/container-platform/4.1/cli_reference/developer-cli-commands.html).

This guide assumes you have a Kubernetes deployment and service accessible publicly by an ingress controller, and that you can run a copy of that service on your laptop.


## Intercept your service with a global intercept

With Telepresence, you can create [global intercepts](../../concepts/intercepts/?intercept=global) that intercept all traffic going to a service in your cluster and route it to your local environment instead. 

1. Connect to your cluster with `telepresence connect` and connect to the Kubernetes API server:

   ```console
   $ curl -ik https://kubernetes.default
   HTTP/1.1 401 Unauthorized
   Cache-Control: no-cache, private
   Content-Type: application/json
   ...

   ```

   <Alert>
    The 401 response is expected when you first connect.
   </Alert>

   You now have access to your remote Kubernetes API server as if you were on the same network. You can now use any local tools to connect to any service in the cluster.

   If you have difficulties connecting, make sure you are using Telepresence 2.0.3 or a later version. Check your version by entering `telepresence version` and [upgrade if needed](../../install/upgrade/).


In this section, we will go through the steps required for you to
create a [global intercept](../../concepts/intercepts/?intercept=global) that
intercepts all traffic going to a service in your cluster and route it
to your local environment instead.  In the [next
section](#4-personal-intercept), we will instead create a personal
intercept that is often more useful than a global intercept.

1. List the services that you can intercept with `telepresence list`
   and make sure the one you want to intercept is listed.

   For example, this would confirm that `example-service` can be intercepted by Telepresence:
=======
2. Enter `telepresence list` and make sure the service you want to intercept is listed. For example:
>>>>>>> c4452984c8ffbc6086fdc6177dc6eb998fc5ddb9

   ```console
   $ telepresence list
   ...
   example-service: ready to intercept (traffic-agent not yet installed)
   ...
   ```

3. Get the name of the port you want to intercept on your service:
   `kubectl get service <service name> --output yaml`.
  
   For example:

   ```console
   $ kubectl get service example-service --output yaml
   ...
     ports:
     - name: http
       port: 80
       protocol: TCP
       targetPort: http
   ...
   ```

4. Intercept all traffic going to the service in your cluster:
    `telepresence intercept <service-name> --port <local-port>[:<remote-port>] --env-file <path-to-env-file>`.
      * For `--port`: specify the port the local instance of your service is running on. If the intercepted service exposes multiple ports, specify the port you want to intercept after a colon.
      * For `--env-file`: specify a file path for Telepresence to write the environment variables that are set in the pod. 
       The example below shows Telepresence intercepting traffic going to service `example-service`. Requests now reach the service on port `http` in the cluster get routed to `8080` on the workstation and write the environment variables of the service to `~/example-service-intercept.env`.
       ```console
       $ telepresence intercept example-service --port 8080:http --env-file ~/example-service-intercept.env
       Using Deployment example-service
       intercepted
           Intercept name: example-service
           State         : ACTIVE
           Workload kind : Deployment
           Destination   : 127.0.0.1:8080
           Intercepting  : all TCP connections
       ```

5. <a name="start-local-instance"></a>Start your local environment using the environment variables retrieved in the previous step.

  The following are some examples of how to pass the environment variables to your local process:
   * **Docker:** enter `docker run` and provide the path to the file using the `--env-file` argument. For more information about Docker run commands, see the [Docker command-line reference documentation](https://docs.docker.com/engine/reference/commandline/run/#set-environment-variables--e---env---env-file).
   * **Visual Studio Code:** specify the path to the environment variables file in the `envFile` field of your configuration.
   * **JetBrains IDE (IntelliJ, WebStorm, PyCharm, GoLand, etc.):** use the [EnvFile plugin](https://plugins.jetbrains.com/plugin/7861-envfile).

6. Query the environment in which you intercepted a service and verify your local instance being invoked.
   All the traffic previously routed to your Kubernetes Service is now routed to your local environment

You can now:
- Make changes on the fly and see them reflected when interacting with
  your Kubernetes environment.
- Query services only exposed in your cluster's network.
- Set breakpoints in your IDE to investigate bugs.

   <Alert severity="info">

    **Didn't work?** Make sure the port you're listening on matches the one you specified when you created your intercept.

   </Alert>

   For the example below, you will create a preview URL that will send
   traffic to the `ambassador` service in the `ambassador` namespace
   on port `443` using TLS encryption and setting the `Host` HTTP
   header to `dev-environment.edgestack.me`:

   ```console
   $ telepresence intercept example-service --port 8080:http --env-file ~/example-service-intercept.env
      To create a preview URL, telepresence needs to know how requests enter 
	    your cluster. Please Select the ingress to use.

      1/4: What's your ingress' IP address?
           You may use an IP address or a DNS name (this is usually a
           "service.namespace" DNS name).

             [default: example-service.default]: ambassador.ambassador

      2/4: What's your ingress' TCP port number?

             [default: 80]: 443

      3/4: Does that TCP port on your ingress use TLS (as opposed to cleartext)?

             [default: n]: y

      4/4: If required by your ingress, specify a different hostname
           (TLS-SNI, HTTP "Host" header) to be used in requests.

             [default: ambassador.ambassador]: dev-environment.edgestack.me

      Using Deployment example-service
      intercepted
         Intercept name         : example-service
         State                  : ACTIVE
         Workload kind          : Deployment
         Destination            : 127.0.0.1:8080
         Service Port Identifier: http
         Intercepting           : HTTP requests that match all of:
            header("x-telepresence-intercept-id") ~= regexp("<intercept id>:example-service")
         Preview URL            : https://<random domain name>.preview.edgestack.me
         Layer 5 Hostname       : dev-environment.edgestack.me
   ```

4. Start your local service as [in the previous
   step](#start-local-instance).

5. Go to the preview URL printed after doing the intercept and see
   that your local service is processing the request.

   <Alert severity="info">

    **Didn't work?** It might be because you have services in between
    your ingress controller and the service you are intercepting that
    do not propagate the `x-telepresence-intercept-id` HTTP Header.
    Read more on [context propagation](../../concepts/context-prop).

   </Alert>

6. Make a request on the URL you would usually query for that
   environment.  The request should not be routed to your laptop.

   Normal traffic coming into the cluster through the Ingress
   (i.e. not coming from the preview URL) will route to services in
   the cluster like normal.

<Alert severity="success">

  **Congratulations!** You have now only intercepted traffic coming
  from your preview URL, without impacting your teammates.

</Alert>

You can now:
- Make changes on the fly and see them reflected when interacting with
  your Kubernetes environment.
- Query services only exposed in your cluster's network.
- Set breakpoints in your IDE to investigate bugs.

...and all of this **without impacting your teammates!**
## <img class="os-logo" src="../../images/logo.png"/> What's Next? {#whats-next}

<QSCards/>
=======
>>>>>>> c4452984c8ffbc6086fdc6177dc6eb998fc5ddb9
