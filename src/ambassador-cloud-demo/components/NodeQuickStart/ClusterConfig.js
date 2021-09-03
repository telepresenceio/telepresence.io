import React from 'react';

import { useAppState } from '../../context'

const ClusterConfig = () => {
  const { userInfo } = useAppState();
  const customText = userInfo ? 'Go to ' : 'Log in and Go to ';

  return (
    <p>
      {customText}
      <a
        href="https://auth.datawire.io/redirects/settings/teams"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        the teams setting page in Ambassador Cloud
      </a>{' '}
      and select <em>Licenses</em> for the team you want to create the license
      for.
    </p>
  );
};

export { ClusterConfig };
