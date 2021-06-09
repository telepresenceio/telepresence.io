import React from 'react';
import HubspotForm from 'react-hubspot-form';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import styles from './styles.module.less';
import { PORTAL_ID } from '../../utils/hubspot';

const WhitePaperLanding = ({ title, content, hubspotFormId }) => (
  <div className={styles.WhitePaperLanding}>
    <section className={styles.Hero}>
      <div className={styles.Container}>
        <h1 className={styles.Title}>{title}</h1>
      </div>
    </section>
    <section className={styles.Content}>
      <div className={styles.Container}>
        <div className={styles.Row}>
          <div className={styles.Teaser}>
            <MDXRenderer>{content}</MDXRenderer>
          </div>
          <div className={styles.SignupForm}>
            <h2>Download Now</h2>
            <HubspotForm
              portalId={PORTAL_ID}
              formId={hubspotFormId}
              loading="Loading..."
              css=""
            />
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default WhitePaperLanding;
