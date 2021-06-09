import React from 'react';

import Layout from '../Layout';
import { useNewsFiltering } from './newsFiltering';
import { BASE_URL } from '../../utils/urls';
import PageHead from '../Head/PageHead';
import RichText from '../RichText/RichText';

import styles from './newsListPage.module.less';
import NewsListCategories from './NewsListCategories';
import NewsCard from './NewsCard';
import NewsListNextEvents from './NewsListNextEvents';

export default ({ data, location, isPreview }) => {
  const filtering = useNewsFiltering(data, location, isPreview);

  const { meta, title, body } = data.page;
  return (
    <>
      <PageHead
        meta={{
          ...meta,
          title,
        }}
        canonicalUrl={BASE_URL + 'about-us/news/'}
        // schema={{ type: 'partnersPage', partners: filtering.allPartners }}
      />
      <Layout location={location}>
        <main>
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
          <div className={styles.featuredSection}>
            <section className={styles.featured} aria-label="Featured news">
              {filtering.featuredNews.map((item) => (
                <NewsCard
                  key={item._id}
                  {...item}
                  isFeatured={true}
                  isH2={true}
                />
              ))}
            </section>
            <NewsListNextEvents />
          </div>
          <NewsListCategories {...filtering} />
          <div className={styles.main}>
            {filtering.filteredNews.map((item) => (
              <NewsCard
                key={item._id}
                {...item}
                isFeatured={false}
                isH2={false}
              />
            ))}
          </div>
        </main>
      </Layout>
    </>
  );
};
