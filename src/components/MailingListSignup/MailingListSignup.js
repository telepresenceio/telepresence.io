import React from 'react';
import HubspotForm from 'react-hubspot-form';

import './styles.css';
import { PORTAL_ID } from '../../utils/hubspot';

const MailingListSignup = () => (
  <div className="bg-white border-gray box-shadow content-box">
    <h1 className="text-lg">Stay Updated</h1>
    <p className="font-light text-md">
      Ambassador is under active development. Subscribe to get updates and
      announcements:
    </p>
    <div className="mailing-list-signup">
      <HubspotForm
        portalId={PORTAL_ID}
        formId="956d4be9-9031-4ba7-8ea0-1468522c7f42"
        loading="Loading..."
        css=""
      />
    </div>
  </div>
);

export default MailingListSignup;
