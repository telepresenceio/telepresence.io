import React, { useMemo } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';
import Link from '../Link';
import RichText from '../RichText/RichText';
import EventDate from './EventDate';
import Icon from '../Icon';
import { Tag } from '../Tag';
import { eventCategories } from './EventsListPage';
import styles from './eventCard.module.less';

const EventCard = ({ excerpt, startDate, endDate, title, url, type }) => {
  const tagProps = useMemo(() => eventCategories.filter(e => e.name === type)[0], [type]);

  const transformedExcerpt = useMemo(() => {
    if (!excerpt) {
      return null;
    }
    if (type === 'webinar') {
      return <div className={styles.content_text}>{excerpt}</div>;
    }

    return (
      <div className={styles.content_text}>
        <RichText blocks={excerpt} />
      </div>
    );
  }, [type, excerpt]);

  return (
    <article className={classnames(styles.eventCard)}>
      <EventDate startDate={startDate} endDate={endDate} />
      <div className={styles.content}>
        <h2 className={styles.content_title}>
          <Link to={url}>
            <span className="visually-hidden">Learn about the event</span>
            {title}
          </Link>
          <div className={styles.content_title_arrow}>
            <Icon name="arrow" />
          </div>
        </h2>
        {tagProps && <Tag {...tagProps} />}
        {transformedExcerpt}
      </div>
    </article>
  );
};

EventCard.propTypes = {
  endDate: PropTypes.string,
  excerpt: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  startDate: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['event', 'webinar', 'developer-office-hours', 'meet-the-maintainers-sessions', 'oss-contributors-meetings', 'ambassador-fest']),
  url: PropTypes.string,
};

export default EventCard;
