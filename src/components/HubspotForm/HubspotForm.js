import React from 'react';
import classnames from 'classnames';
import { useInView } from 'react-intersection-observer';
import { nanoid } from 'nanoid';
// components
import { PORTAL_ID } from '../../utils/hubspot';
// styles
import './styles.less';

const HS_JS = '//js.hsforms.net/forms/v2.js';

const HubspotForm = ({
  formId = '956d4be9-9031-4ba7-8ea0-1468522c7f42',
  title,
  textCenter = false,
  children,
}) => {
  const [wrapperRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px 300px 0px',
  });
  const formElRef = React.useRef(null);
  const [formCreated, setCreation] = React.useState(false);
  const [formLoaded, setLoaded] = React.useState(false);
  const formElId = React.useMemo(() => 'id' + nanoid(), []);

  function createForm() {
    if (window.hbspt) {
      if (!formElRef || !formElRef.current) {
        return;
      }
      window.hbspt.forms.create({
        formId,
        portalId: PORTAL_ID,
        target: `#${formElId}`,
        css: '',
      });
      setCreation(true);
      checkIfFormLoaded();
    } else {
      // If we don't have the script loaded yet, wait ~25ms until we try again
      setTimeout(createForm, 25);
    }
  }

  // Will get Hubspot JS file from their CDN and attach an onload handler to it
  function loadScript() {
    let script = document.createElement(`script`);
    script.defer = true;
    script.onload = () => {
      createForm();
    };
    script.src = HS_JS;
    document.head.appendChild(script);
  }

  // Check whether or not we can replace the "Loading..." placeholder
  function checkIfFormLoaded() {
    let form = formElRef.current.querySelector(`iframe`);
    if (form) {
      // Used to remove the "Loading..." placeholder and use `display: block` for the formEl
      setLoaded(true);
    } else {
      // If the specific form hasn't loaded yet, wait ~25ms until we try again
      setTimeout(checkIfFormLoaded, 25);
    }
  }

  React.useEffect(
    () => {
      // To avoid unnecessary script loading (performance), we only load the script when in view
      // Also, we must avoid re-creating the form if it's already been created
      if (inView && !formCreated) {
        const scripts = Array.from(
          document.head.getElementsByTagName('script'),
        );
        const hsScript = scripts.find(
          (el) => el.getAttribute('src') === '//js.hsforms.net/forms/v2.js',
        );
        if (hsScript) {
          // If the script is already loaded, createForm
          createForm();
        } else {
          loadScript();
        }
      }
    },
    // We don't mind the other deps for this hook, but esLint will yell at us for not including them, so we ignore its suggestions here
    /*eslint-disable */
    [inView],
    /*eslint-enable */
  );

  return (
    <div
      ref={wrapperRef}
      className={classnames(
        'hubspot-form',
        textCenter && 'hubspot-form_center',
      )}
    >
      {title && <h2>{title}</h2>}
      {inView && (
        // Will wrap the Hubspot Form
        <div
          ref={formElRef}
          id={formElId}
          style={{ display: formLoaded ? 'block' : 'none' }}
        />
      )}
      {/* Loading placeholder */}
      {!formLoaded && (children || <div>Loading...</div>)}
    </div>
  );
};

export default HubspotForm;
