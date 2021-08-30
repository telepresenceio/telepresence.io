import React from 'react';

import { useAppState } from '../../context';
import { Login } from '../NodeQuickStart';

const DemoClusterMetadata = ({type, children}) => {
  const {userInfo, demoClusterMetadata} = useAppState();

  const renderMessage = () => {
    if (!userInfo?.username)
      return (<Login/>);
    switch (type) {
      case 'externalIp':
        return demoClusterMetadata?.externalIp ?
          (<a href={`http://${demoClusterMetadata.externalIp}`} target="_blank" rel="noreferrer"> {children} </a>) :
          (<Login/>);
      case 'externalIp-text':
        return demoClusterMetadata?.externalIp ?
          (`http://${demoClusterMetadata.externalIp}`) :
          ("< ACTIVATE A DEMO CLUSTER >");
      case 'apiKey':
        return demoClusterMetadata?.agentApiKey ?
          (`${demoClusterMetadata.agentApiKey}`) :
          (<Login/>);
      case 'kubeConfig':
        return demoClusterMetadata?.kubeConfig ? demoClusterMetadata.kubeConfig : ("< ACTIVATE A DEMO CLUSTER >");
      default:
        return "";
    }
  }

  return (
    renderMessage()
  );
}

export { DemoClusterMetadata };
