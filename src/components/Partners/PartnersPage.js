import React from 'react';

import PartnerCard from './PartnerCard';
import Layout from '../Layout';
import { usePartnersFiltering } from './partnersFiltering';
import { BASE_URL } from '../../utils/urls';
import PageHead from '../Head/PageHead';
import RichText from '../RichText/RichText';

import styles from './partnersPage.module.less';
import PartnerCategories from './PartnerCategories';

export default ({ data, location, isPreview }) => {
  const filtering = usePartnersFiltering(data, location, isPreview);

  const { page = {} } = data;
  const { meta, title, body } = page;
  return (
    <>
      <PageHead
        meta={{
          ...meta,
          title,
        }}
        canonicalUrl={BASE_URL + 'partners/'}
        schema={{ type: 'partnersPage', partners: filtering.allPartners }}
      />
      <Layout location={location}>
        <main>
          {data.page && (
            <section className={styles.hero}>
              <h1>{title}</h1>
              {body && (
                <RichText
                  className={styles.body}
                  renderContainerOnSingleChild={true}
                  blocks={body}
                />
              )}
            </section>
          )}
          <PartnerCategories {...filtering} />
          <section className={styles.results}>
            {filtering.filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.name}
                {...partner}
                includeType={data?.types?.nodes?.length > 2}
                chooseFilter={filtering.chooseFilter}
              />
            ))}
          </section>
        </main>
      </Layout>
    </>
  );
};
