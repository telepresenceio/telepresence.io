import React from 'react';

import { useStaticQuery, graphql } from 'gatsby';
import { SanityFluidImage } from '../SanityImage/SanityImage';
import Link from '../Link';
import Icon from '../Icon';
import { getFormattedDate } from '../../utils/date';

import styles from './EventsListLatestNews.module.less';

const NewsShortPreview = ({ meta }) => (
  <article className={styles.card}>
    <p className={styles.date}>
      <span className="visually-hidden">News released on </span>
      {getFormattedDate(meta.date)}
    </p>
    {meta.image && (
      <SanityFluidImage
        assetId={meta.image.asset?._id}
        fluidOptions={{ maxWidth: 100 }}
      />
    )}
    <h3 className={styles.card_title}>
      <Link to={meta.url || `/${meta.slug.current}`}>
        <span className="visually-hidden">Read </span>
        {meta.title}
      </Link>
    </h3>
  </article>
);

const EventsListLatestNews = () => {
  const data = useStaticQuery(graphql`
    {
      newsPg: sanityNewsPg(_id: { eq: "newsPg" }) {
        featuredNews {
          _id
          meta {
            title
            date
            url
            slug {
              current
            }
            image {
              asset {
                _id
              }
            }
          }
        }
      }
      rest: allSanityNews(sort: { fields: meta___date, order: ASC }, limit: 4) {
        nodes {
          _id
          meta {
            title
            date
            url
            image {
              asset {
                _id
              }
            }
          }
        }
      }
    }
  `);
  const news = React.useMemo(() => {
    const featuredNews = data.newsPg.featuredNews || [];
    const featuredNewsIds = featuredNews.map((n) => n._id);
    const nonFeaturedNews = data.rest.nodes.filter(
      (n) => featuredNewsIds.indexOf(n._id) < 0,
    );
    // Up to 3 news
    return [...featuredNews, ...nonFeaturedNews].slice(0, 3);
  }, [data]);
  return (
    <section className={styles.news}>
      <h2>Featured News</h2>
      <div className={styles.newsContainer}>
        {news.map((item, i) => (
          <NewsShortPreview key={item.meta?.title || `news-${i}`} {...item} />
        ))}
      </div>
      <p className={styles.allNews}>
        <Link to="/about-us/news/">More news</Link>
        <Icon name="arrow" className={styles.allNews_arrow} />
      </p>
    </section>
  );
};

export default EventsListLatestNews;
