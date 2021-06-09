import React from 'react';
import DateIcon from '../icons/DateIcon';
import EventShortPreview from '../Events/EventShortPreview';

import styles from './newsListPage.module.less';
import { useStaticQuery, graphql } from 'gatsby';
import Link from '../Link';

const NewsListNextEvents = () => {
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
    const featuredEventsIds = featuredEvents.map((n) => n._id);
    const nonFeaturedEvents = data.rest.nodes.filter(
      (n) => featuredEventsIds.indexOf(n._id) < 0,
    );
    // Up to 4 events
    return [...featuredEvents, ...nonFeaturedEvents].slice(0, 4);
  }, [data]);
  return (
    <section className={styles.events}>
      <h2>
        <DateIcon /> Featured events
      </h2>
      <div className={styles.eventsContainer}>
        {events.map((item, i) => (
          <EventShortPreview key={item.meta?.title || `evt-${i}`} {...item} />
        ))}
      </div>
      <p className={styles.allEvents}>
        <Link to="/about-us/events/">View all events</Link>
      </p>
    </section>
  );
};

export default NewsListNextEvents;
