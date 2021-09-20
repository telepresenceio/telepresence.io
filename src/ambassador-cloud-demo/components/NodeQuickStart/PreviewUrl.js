import React, { useEffect, useState } from 'react';

import { useAppState } from '../../context';
import { telepresenceIntercept } from '../../utils/telepresenceIntercept';

const PreviewUrl = ({children}) => {
  const { userServices, demoClusterMetadata } = useAppState();
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (userServices?.length && demoClusterMetadata?.name)
      setPreviewUrl(userServices?.find(
        (service) => (service?.cluster?.name === demoClusterMetadata?.name) && service.intercepts && service.intercepts[0]?.name === telepresenceIntercept,
      )?.intercepts[0].previewURL || '');
  }, [demoClusterMetadata, userServices]);

  const render = () => {
    if (previewUrl)
      return (<a href={previewUrl.url} target='_blank' rel="noreferrer">{children || previewUrl.url}</a>);
    else
      return ( children || "preview URL");
  };

  return (render());
};

export { PreviewUrl }
