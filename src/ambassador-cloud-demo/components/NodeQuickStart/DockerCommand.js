import React from 'react';

import { useAppState } from '../../context';
import { default as CodeBlock } from '../../../components/CodeBlock';


const DockerCommand = () => {
  const { demoClusterMetadata } = useAppState();

  const buildDockerCommand = () => {
    let command = '$ docker run -p8083:8083 -p8080:8080 --name ambassador-demo --cap-add=NET_ADMIN --device /dev/net/tun:/dev/net/tun --pull always --rm -it ';
    command += `-e AMBASSADOR_API_KEY=${demoClusterMetadata?.agentApiKey || ''} `;
    if (typeof window !== "undefined" && (window?.location?.hostname || '').endsWith('.netlify-preview.datawire.io')) {
      command += `-e SYSTEMA_ENV=staging `;
    }
    command += 'datawire/demoemojivoto';
    return command;
  };

  return (<CodeBlock className={`console`}>{
    buildDockerCommand() + "\n\n" +
    `\tConnected to context telepresence-demo (https://${demoClusterMetadata?.externalIp || "$DEMO_CLUSTER_IP"})\n`+
    "\temoji             : ready to intercept (traffic-agent not yet installed)\n"+
    "\tweb               : ready to intercept (traffic-agent not yet installed)\n"+
    "\tvoting            : ready to intercept (traffic-agent not yet installed)\n"+
    "\tweb-app-778477c59c: ready to intercept (traffic-agent not yet installed)\n"
  }</CodeBlock>);
};

export { DockerCommand }
