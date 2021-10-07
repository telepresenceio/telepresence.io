import React from 'react';

import { useAppState } from '../../../context';

const ExternalIp = ({children}) => {
  const { demoClusterMetadata } = useAppState();
  const render = ()=> {
    if (demoClusterMetadata?.externalIp)
      return (<a href={`http://${demoClusterMetadata.externalIp}`} target="_blank" rel="noreferrer">{children || `remote demo cluster`}</a>);
    else
      return (children || 'remote demo cluster');
  };
  return (render());
};

export {ExternalIp};
