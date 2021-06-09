import React from 'react';

import Layout from '../../components/Layout';
import HubspotForm from '../../components/HubspotForm';
import RichText from '../RichText/RichText';

import styles from './styles.module.less';
import PageHead from '../Head/PageHead';

const DemoPage = ({ location, data: { page } }) => (
  <Layout location={location}>
    <PageHead meta={page.meta} />
    <section className={styles.Hero}>
      <h1>{page.title}</h1>
      {page.body && <RichText blocks={page.body} />}
    </section>
    <section className={styles.ContactFormSection}>
      <div className={styles.ContactForm}>
        <div className={styles.Content}>
          <div className={styles.ContactFormForm}>
            {page.formTitle && <h2>{page.formTitle}</h2>}
            <div className="contact-form">
              <HubspotForm formId={page.formId} />
            </div>
          </div>
          {page.bodyRight && (
            <RichText blocks={page.bodyRight} className={styles.Benefits} />
          )}
        </div>
        {page.bodyBelow && <RichText blocks={page.bodyBelow} />}
      </div>
    </section>
  </Layout>
);

export default DemoPage;
