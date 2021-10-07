import React from 'react';

import { useAppState } from '../../../context';
import { default as CodeBlock } from '../../CodeBlock';

const LoginCommand = () => {
  const { demoClusterMetadata } = useAppState();
  
    return (<CodeBlock className={`console`}>{demoClusterMetadata?.agentApiKey ?
      `$ telepresence login --apikey ${demoClusterMetadata.agentApiKey}` :
      `$ telepresence login --apikey $APIKEY`}</CodeBlock>);

};

export { LoginCommand };
