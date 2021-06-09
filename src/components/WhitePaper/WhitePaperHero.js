import React from 'react';
import HubspotForm from 'react-hubspot-form';

import styles from './styles.module.less';
import RichText from '../RichText/RichText';
import { PORTAL_ID } from '../../utils/hubspot';

export default ({ meta, hubspotFormId, description }) => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>{meta.title}</h1>
          {description && <RichText blocks={description} />}
        </div>
        <div className={styles.form}>
          <h2>Download Now</h2>
          <HubspotForm
            portalId={PORTAL_ID}
            formId={hubspotFormId}
            loading={'Loading form...'}
            css=""
          />
        </div>
      </div>
    </section>
  );
};
