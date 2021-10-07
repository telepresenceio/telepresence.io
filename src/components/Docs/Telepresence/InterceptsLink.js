import React, { useState, useEffect } from 'react';

import { useAppState } from '../../../context';
import { getBaseUIUrl } from '../../../utils/getBaseUrl';

const InterceptsLink = ({ children }) => {
  const { userServices, demoClusterMetadata } = useAppState();
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (userServices?.length && demoClusterMetadata?.name)
      setPreviewUrl(userServices?.find(
        (service) => (service?.cluster?.name === demoClusterMetadata?.name) && service.intercepts && service.intercepts[0]?.name === 'web',
      )?.intercepts[0].previewURL || '');
  }, [demoClusterMetadata, userServices]);

  if (!previewUrl) return children;

  return (
    <a
      href={`${getBaseUIUrl()}/services/web-svc/intercepts?env=Development&utm_source=docs&utm_medium=telepresence-quick-start-20210730&utm_content=completion`}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export { InterceptsLink }
