import React from 'react';

import Layout from '../Layout';
import Link from '../Link';
import PageHead from '../Head/PageHead';
import RichText from '../RichText/RichText';
import HubspotForm from '../HubspotForm';
import { TwitterLogo, SlackLogo, MediumLogo } from '../icons/socialIcons';

import styles from './styles.module.less';

const ContactPage = ({ location, data: { page } }) => (
  <Layout location={location}>
    <PageHead meta={page.meta} />
    <section className={styles.Hero}>
      <h1>{page.title}</h1>
      {page.body && <RichText blocks={page.body} />}
    </section>
    <section className={styles.ContactFormSection}>
      <div className={styles.ContactForm}>
        <div className={styles.ContactFormForm}>
          {page.formTitle && <h2>{page.formTitle}</h2>}
          <div className="contact-form">
            <HubspotForm formId={page.formId} />
          </div>
        </div>
        <div className={styles.SocialLinks}>
          <h2>Social</h2>
          <Link
            className={styles.Link}
            to="https://twitter.com/getambassadorio"
          >
            <TwitterLogo />
            Twitter
          </Link>
          <Link className={styles.Link} to="http://a8r.io/Slack">
            <SlackLogo />
            Slack
          </Link>
          <Link className={styles.Link} to="https://blog.getambassador.io/">
            <MediumLogo />
            Blog
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default ContactPage;
