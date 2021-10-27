import React from 'react';


const ClusterConfig = () => {
  const customText = 'Log in and Go to ';

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
