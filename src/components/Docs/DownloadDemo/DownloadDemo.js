import React from 'react';

const DownloadDemo = () => {
  const customText = 'Go to Ambassador Cloud to download your demo cluster archive. ';

  return (
    <>
      <a
        href="https://app.getambassador.io/cloud/demo-cluster-download-popup"
        target="_blank" rel="noreferrer"
      >
        {customText}
      </a>{' '}
      The archive contains all the tools and configurations you need to complete
      this guide.
    </>
  );
};

export { DownloadDemo };
