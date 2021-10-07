import React, { useEffect, useState } from 'react';

import { useAppState } from '../../../context';
import { web, voting } from '../../../utils/telepresenceIntercept';

const serviceByLang = {
  go: voting,
  'demo_node': web,
};

const PreviewUrl = ({ children, language = 'demo_node' }) => {
  const { userServices, demoClusterMetadata } = useAppState();
  const [previewUrl, setPreviewUrl] = useState('');
  const interceptedService = serviceByLang[language];

  useEffect(() => {
    if (userServices?.length && demoClusterMetadata?.name)
      setPreviewUrl(userServices?.find(
        (service) => (service?.cluster?.name === demoClusterMetadata?.name) && service.intercepts && service.intercepts[0]?.name === interceptedService,
      )?.intercepts[0].previewURL || '');
  }, [demoClusterMetadata, userServices, interceptedService]);

  const render = () => {
    if (previewUrl)
      return (<a href={previewUrl.url} target='_blank' rel="noreferrer">{children || previewUrl.url}</a>);
    else
      return (children || "preview URL");
  };

  return (render());
};

export { PreviewUrl }
