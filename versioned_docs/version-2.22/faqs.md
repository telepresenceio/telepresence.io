---
title: FAQs
description: "Learn how Telepresence helps with fast development and debugging in your Kubernetes cluster."
hide_table_of_contents: true
---

# FAQs

** Why Telepresence?**

Modern microservices-based applications that are deployed into Kubernetes often consist of tens or hundreds of services. The resource constraints and number of these services means that it is often difficult to impossible to run all of this on a local development machine, which makes fast development and debugging very challenging. The fast [inner development loop](concepts/devloop.md) from previous software projects is often a distant memory for cloud developers.

Telepresence enables you to connect your local development machine seamlessly to the cluster via a two way proxying mechanism. This enables you to code locally and run the majority of your services within a remote Kubernetes cluster -- which in the cloud means you have access to effectively unlimited resources.

Ultimately, this empowers you to develop services locally and still test integrations with dependent services or data stores running in the remote cluster.

Telepresence provides three different ways for you to code, debug, and test your service locally using your favourite local IDE and in-process debugger.

First off, you can "replace" the service with your own local version. This means even though you run your service locally, you can see how it interacts with the rest of the services in the cluster. It's like swapping out a piece of a puzzle and seeing how the whole picture changes. Your local process will have access to the same network, environment, and volumes as the service that it replaces.

You can also "intercept" any requests made to a service. This is similar to replacing the service, but the remote service will keep running, perform background tasks, and handle traffic that isn't intercepted.

Finally, you can "ingest" a service. Again, similar to a "replace", but nothing changes in the cluster during an "ingest", and no traffic is routed to the workstation.

** What operating systems does Telepresence work on?**

Telepresence currently works natively on macOS (Intel and Apple Silicon), Linux, and Windows.

** What protocols can be intercepted by Telepresence?**

Both TCP and UDP are supported.

** When using Telepresence run a cluster service locally, are the Kubernetes cluster environment variables proxied on my local machine?**

Yes, you can either set the container's environment variables on your machine or write the variables to a file to use with Docker or another build process. You can also directly pass the environments to a handler that runs locally. Please see [the environment variable reference doc](reference/environment.md) for more information.

** When using Telepresence to run a cluster service locally, can the associated container volume mounts also be mounted by my local machine?**

Yes, please see [the volume mounts reference doc](reference/volume.md) for more information.

** When connected to a Kubernetes cluster via Telepresence, can I access cluster-based services via their DNS name?**

Yes. After you have successfully connected to your cluster via `telepresence connect -n <my_service_namespace>` you will be able to access any service in the connected namespace in your cluster via their DNS name.

This means you can curl endpoints directly e.g. `curl <my_service_name>:8080/mypath`.

You can also access services in other namespaces using their namespaced qualified name, e.g.`curl <my_service_name>.<my_other_namespace>:8080/mypath`.

You can connect to databases or middleware running in the cluster, such as MySQL, PostgreSQL and RabbitMQ, via their service name.

** When connected to a Kubernetes cluster via Telepresence, can I access cloud-based services and data stores via their DNS name?**

You can connect to cloud-based data stores and services that are directly addressable within the cluster (e.g. when using an [ExternalName](https://kubernetes.io/docs/concepts/services-networking/service/#externalname) Service type), such as AWS RDS, Google pub-sub, or Azure SQL Database.




** Will Telepresence be able to engage with workloads running on a private cluster or cluster running within a virtual private cloud (VPC)?**

Yes, but it doesn't need to have a publicly accessible IP address.

The cluster must also have access to an external registry to be able to download the traffic-manager and traffic-agent images that are deployed when connecting with Telepresence.

** Why does running Telepresence require sudo access for the local daemon unless it runs in a Docker container?**

The local daemon needs sudo to create a VIF (Virtual Network Interface) for outbound routing and DNS. Root access is needed to do that unless the daemon runs in a Docker container.

** What components get installed in the cluster when running Telepresence?**

A single `traffic-manager` service is deployed in the `ambassador` namespace within your cluster, and this manages resilient intercepts and connections between your local machine and the cluster.

A Traffic Agent container is injected per pod that is being engaged. The first time a `replace`, an `ingest`, or an `intercept` is made on a workload, all pods associated with this workload will be restarted with the Traffic Agent automatically injected.

** How can I remove all the Telepresence components installed within my cluster?**

You can run the command `telepresence helm uninstall` to remove everything from the cluster, including the `traffic-manager`, and all the `traffic-agent` containers injected into each pod being engaged.

Also run `telepresence quit -s` to stop all local daemons running.

** What language is Telepresence written in?**

All components of the Telepresence application and cluster components are written using Go. 

** How does Telepresence connect and tunnel into the Kubernetes cluster?**

The connection between your laptop and cluster is established by using
the `kubectl port-forward` machinery (though without actually spawning
a separate program) to establish a TLS encrypted connection to Telepresence
Traffic Manager and Traffic Agents in the cluster, and running Telepresence's custom VPN
protocol over that connection.

<a name="idps"></a>

** Is Telepresence OSS open source?**

Yes it is! You'll find both source code and documentation in the [Telepresence GitHub repository](https://github.com/telepresenceio/telepresence), licensed using the [apache License Version 2.0](https://github.com/telepresenceio/telepresence?tab=License-1-ov-file#readme).

** How do I share my feedback on Telepresence?**

Your feedback is always appreciated and helps us build a product that provides as much value as possible for our community. You can chat with us directly on our #telepresence-oss channel at the [CNCF Slack](https://slack.cncf.io), and also report issues or create pull-requests on the GitHub repository.
