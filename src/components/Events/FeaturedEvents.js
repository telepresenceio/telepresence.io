import React from 'react';
import classnames from 'classnames';
import { useStaticQuery, graphql } from 'gatsby';

import RichText from '../RichText/RichText';

import styles from './featuredEvents.module.less';
import OldEventCard from './OldEventCard';

export default ({ title, body }) => {
  const data = useStaticQuery(graphql`
    {
      eventsPg: sanityEventsPg(_id: { eq: "eventsPg" }) {
        featuredEvents {
          _id
          meta {
            startDate
            title
            url
            slug {
              current
            }
          }
        }
      }
      rest: allSanityEvent(
        sort: { fields: meta___startDate, order: DESC }
        limit: 4
      ) {
        nodes {
          _id
          meta {
            startDate
            title
            url
            slug {
              current
            }
          }
        }
      }
    }
  `);
  const events = React.useMemo(() => {
    const featuredEvents = data.eventsPg.featuredEvents || [];
    if (featuredEvents.length) {
      return featuredEvents;
    }
    return data.rest.nodes;
  }, [data]);
  if (!events.length) {
    return null;
  }
  return (
    <section className={styles.wrapper}>
      {title && <h2>{title}</h2>}
      {body && <RichText blocks={body} />}
      <div className={classnames(styles.cardsContainer)}>
        {events.map((item = {}) => (
          <OldEventCard key={item._id} {...item} />
        ))}
      </div>
    </section>
  );
};
