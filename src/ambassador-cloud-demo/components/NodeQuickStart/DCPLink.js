import React from 'react';

import { getBaseUIUrl } from '../../utils/getBaseUrl';

const DCPLink = ({children}) => {
  return (<a href={`${getBaseUIUrl()}/services`} target="_blank" rel="noreferrer">{children}</a>);
};

export { DCPLink }
