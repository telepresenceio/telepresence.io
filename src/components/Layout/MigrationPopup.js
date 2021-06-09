import React from 'react';
import queryString from 'query-string';
import { DialogOverlay, DialogContent } from '@reach/dialog';

import Button from '../Button/Button';

const URLS_WITH_POPUP = [
  'https://www.datawire.io/',
  'https://www.datawire.io/about/',
  'https://www.datawire.io/demo/',
  'https://www.datawire.io/support/',
  'https://www.datawire.io/announcing-kubernaut-instantaneous-ephemeral-kubernetes-clusters-cloud/',
  'https://www.datawire.io/blackbird/',
  'https://www.datawire.io/careers/',
  'https://www.datawire.io/contact/',
  'https://www.datawire.io/datawire-helping-developers-code-faster-kubernetes/',
  'https://www.datawire.io/developing-resilient-microservices-kubernetes-envoy-velocity-nyc-2017/',
  'https://www.datawire.io/distinguishing-type-constructors-arguments-comparison-expressions-parsing/',
  'https://www.datawire.io/fast-builds-java-spring-boot-applications-docker/',
  'https://www.datawire.io/introducing-datawire-connect-resilient-microservices/',
  'https://www.datawire.io/introducing-datawire-microservices-development-kit-mission-control/',
  'https://www.datawire.io/pricing/',
  'https://www.datawire.io/reference-architecture-developing-kubernetes-services/',
  'https://www.datawire.io/reference-architecture/',
];

export const useMigrationPopup = (location = {}) => {
  const [popupVisible, showPopup] = React.useState(false);
  React.useEffect(() => {
    const query = queryString.parse((location && location.search) || '');
    if (!query.utm_source) {
      return;
    }
    if (URLS_WITH_POPUP.indexOf(query.utm_source) >= 0) {
      showPopup(true);
    }
  }, [location]);

  return [popupVisible, showPopup];
};

export const MigrationPopup = () => {
  const [isOpen, setOpen] = React.useState(true);
  const close = () => setOpen(false);
  return (
    <DialogOverlay
      isOpen={isOpen}
      style={{
        zIndex: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'hsla(0, 0%, 0%, 0.33)',
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        overflow: 'auto',
      }}
    >
      <DialogContent
        style={{
          background: 'white',
          width: '90vw',
          maxWidth: '450px',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          className="close-button"
          onClick={close}
          style={{
            position: 'absolute',
            top: '.5rem',
            right: '.5rem',
            background: 'transparent',
            border: '1px solid #ff4329',
            cursor: 'pointer',
          }}
        >
          <span className="visually-hidden">Close</span>{' '}
          <span aria-hidden>×</span>
        </button>
        <div aria-hidden>
          <img
            alt=""
            src="/images/datawire-logo.svg"
            style={{
              margin: '0 auto 1rem',
              filter: 'saturate(0)',
              opacity: 0.8,
              width: '30%',
              display: 'block',
            }}
          />
          <img
            alt=""
            style={{ width: '70%' }}
            src="/images/ambassador-logo-black.svg"
          />
        </div>
        <h1
          style={{ margin: '1rem 0 0', fontSize: '1.75rem', lineHeight: '1.1' }}
        >
          Datawire is now Ambassador
        </h1>
        <p style={{ margin: '.5rem 0 1.5rem' }}>
          Datawire, the team behind the Ambassador Edge Stack is now doing
          business as Ambassador Labs and has moved all relevant resources over
          to getambassador.io. Please contact us if you have any questions.
        </p>
        <Button to="contact" color="red-outline" size="sm">
          Contact us
        </Button>
      </DialogContent>
    </DialogOverlay>
  );
};
