import React from 'react';

import { useAppState } from '../../../context';
import { default as CodeBlock } from '../../CodeBlock';

const languagesData = {
  'demo-node': {
    name: '--name ambassador-demo',
    image: 'datawire/demoemojivoto',
    ports: '-p8083:8083 -p8080:8080',
  },
  go: {
    name: '--name voting-demo',
    image: 'datawire/telepresence-emojivoto-go-demo',
    ports: '-p8083:8083',
  },
}
const volumes = {
  'windows_appData': '-v %AppData%:/root/.host_config',
  'windows_userProfile': '-v %userprofile%\\AppData\\Roaming:/root/.host_config',
  'linux': `-v $(if [[  "\${XDG_CONFIG_HOME}" ]]; then echo "\${XDG_CONFIG_HOME}"; else echo "$HOME/.config"; fi):/root/.host_config`,
  'macos': `-v ~/Library/Application\\ Support:/root/.host_config`,
}

const DockerCommand = ({ language = 'demo-node', osType }) => {
  const { demoClusterMetadata } = useAppState();
  const apiKeyEnv = `-e AMBASSADOR_API_KEY=${demoClusterMetadata?.agentApiKey || ''}`
  const systemAEnv = typeof window !== 'undefined' && (window?.location?.hostname || '').endsWith('.netlify-preview.datawire.io') ? '-e SYSTEMA_ENV=staging' : '';
  const commonParams = '--cap-add=NET_ADMIN --device /dev/net/tun:/dev/net/tun --pull always --rm -it';

  const buildDockerCommand = () => {
    const langData = languagesData[language];
    let command = `docker run ${langData.ports} ${langData.name} ${commonParams} ${apiKeyEnv} ${systemAEnv}`
    switch (osType) {
      case 'linux':
        command = `$ ${command} ${volumes[osType]} ${langData.image}`;
        break;
      case 'macos':
        command = `$ ${command} ${volumes[osType]} ${langData.image}`;
        break;
      case 'windows':
        command = `$ IF %AppData%=="" (${command} ${volumes['windows_userProfile']} ${langData.image}) ELSE (${command} ${volumes['windows_appData']} ${langData.image})`;
        break;
      default:
        command = `$ ${command} ${langData.image}`
        break;
    }
    return command;
  };

  const buildShellContent = () => {
    switch (language) {
      case 'demo-node':
        return `
\tConnected to context telepresence-demo (https://${demoClusterMetadata?.externalIp || "$DEMO_CLUSTER_IP"})\n
\temoji             : ready to intercept (traffic-agent not yet installed)\n
\tweb               : ready to intercept (traffic-agent not yet installed)\n
\tvoting            : ready to intercept (traffic-agent not yet installed)\n
\tweb-app-778477c59c: ready to intercept (traffic-agent not yet installed)\n
        `;
      case 'go':
        return `
\tConnected to context telepresence-demo (https://${demoClusterMetadata?.externalIp || "$DEMO_CLUSTER_IP"})\n
\temoji             : ready to intercept (traffic-agent not yet installed)\n
\tweb               : ready to intercept (traffic-agent not yet installed)\n
\tvoting            : ready to intercept (traffic-agent not yet installed)\n
\tweb-app-778477c59c: ready to intercept (traffic-agent not yet installed)\n
\troot@/opt/emojivoto#
`;
      default:
        return '';
    }
  }

  return (
    <CodeBlock className="console">
      {`${buildDockerCommand()}\n\n${buildShellContent()}`}
    </CodeBlock>
  );
}

export { DockerCommand }
