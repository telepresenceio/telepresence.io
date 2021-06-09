import React from 'react';

import Layout from '../Layout';
import { BASE_URL } from '../../utils/urls';
import PageHead from '../Head/PageHead';

import styles from './featuresPage.module.less';
import NotFoundPage from '../../pages/404';
import { getScripts } from '../../utils/pageUtils';
import PageBody from '../PageBody';
import RichText from '../RichText/RichText';

export default ({ data, location, pageContext }) => {
  const { meta, heroTitle, heroBody } = data.page;
  const { parsedBody } = pageContext;
  const { bodyStartScripts, bodyEndScripts } = getScripts(meta);
  // Prevent displaying this page when we don't have a published newsPg in the CMS
  if (!parsedBody) {
    return <NotFoundPage />;
  }
  return (
    <>
      <PageHead meta={meta} canonicalUrl={BASE_URL + 'features/'} />
      <div dangerouslySetInnerHTML={{ __html: bodyStartScripts }}></div>
      <Layout location={location}>
        <div className={styles.FeaturesPage}>
          <section className={styles.Hero}>
            <div className={styles.Container}>
              <h1>{heroTitle}</h1>
              {heroBody && <RichText blocks={heroBody} />}
            </div>
          </section>
          <PageBody blocks={parsedBody} />
        </div>
      </Layout>
      <div dangerouslySetInnerHTML={{ __html: bodyEndScripts }}></div>
    </>
  );
};
