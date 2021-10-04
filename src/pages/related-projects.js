import React from 'react';

import EasyLayout from '../components/EasyLayout';
import Markdown from '../components/Markdown';

export default function RelatedProjectsPage({ location }) {
  return (
    <EasyLayout title="Related Projects" location={location}>
      <Markdown>{`
# Related Projects

Ambassador Labs has a number of open source projects that are designed to improve the developer workflow on Kubernetes.

* [Forge](https://forge.sh) allows developers to define and deploy multi-container applications into Kubernetes, from source, incredibly fast.

* [Ambassador](https://www.getambassador.io) is a Kubernetes-native API Gateway built on the [Envoy Proxy](https://envoyproxy.github.io), designed for microservices.
`}</Markdown>
    </EasyLayout>
  );
}
