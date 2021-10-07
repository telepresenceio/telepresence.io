import React from 'react';

import { useAppState } from '../../../context';
import { getBaseUIUrl } from '../../../utils/getBaseUrl';

const EmojivotoServicesList = () => {
  const {demoClusterMetadata} = useAppState();
  const baseUrl = getBaseUIUrl();

  const renderList = () => {
    return demoClusterMetadata?.externalIp ?
      <ul>
        <li>
          <a href={`${baseUrl}/services/voting-svc/details?env=Development`} target="_blank" rel="noreferrer"> voting-svc </a>
        </li>
        <li>
          <a href={`${baseUrl}/services/emoji-svc/details?env=Development`} target="_blank" rel="noreferrer"> emoji-svc </a>
        </li>
        <li>
          <a href={`${baseUrl}/services/web-app/details?env=Development`} target="_blank" rel="noreferrer"> web-app </a>
        </li>
        <li>
          <a href={`${baseUrl}/services/web-svc/details?env=Development`} target="_blank" rel="noreferrer"> web-svc </a>
        </li>
      </ul>
      :
      (<></>)
  };

  return (renderList());
};

export { EmojivotoServicesList };
