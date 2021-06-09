import React from 'react';
import classnames from 'classnames';
import { useStaticQuery, graphql } from 'gatsby';

import RichText from '../RichText/RichText';

import styles from './featuredNews.module.less';
import NewsCard from './NewsCard';

export default ({ title, body, featuredPreview }) => {
  const { newsPg } = useStaticQuery(graphql`
    {
      newsPg: sanityNewsPg(_id: { eq: "newsPg" }) {
        featuredNews {
          _id
          meta: _rawMeta(resolveReferences: { maxDepth: 1 })
        }
      }
    }
  `);
  const featured = newsPg.featuredNews;
  const news = featuredPreview || featured || [];
  if (!news.length) {
    return null;
  }
  return (
    <section className={styles.wrapper}>
      {title && <h2>{title}</h2>}
      {body && <RichText blocks={body} className={styles.body} />}
      <div className={classnames(styles.cardsContainer)}>
        {news.map((item = {}) => (
          <NewsCard key={item._id} {...item} />
        ))}
      </div>
    </section>
  );
};
