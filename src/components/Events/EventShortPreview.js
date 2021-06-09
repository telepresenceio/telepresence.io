import React from 'react';

import styles from './eventShortPreview.module.less';
import Link from '../Link';

const EventShortPreview = ({ meta }) => {
  const { startDate, url, title, slug } = meta;

  const finalUrl = slug?.current || url;
  return (
    <article>
      <Link className={styles.card} to={finalUrl}>
        {startDate && (
          <p className={styles.date}>
            {/* Visually hidden text for screen readers */}
            <span className="visually-hidden">Event happening on </span>
            {new Date(startDate).toLocaleDateString('en', {
              timeZone: 'utc',
              day: '2-digit',
            })}
            <span className={styles.month}>
              {new Date(startDate).toLocaleDateString('en', {
                month: 'short',
                timeZone: 'utc',
              })}
            </span>
          </p>
        )}
        <h3>{title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#5F3EFF"
          viewBox="0 0 12 19"
        >
          <path d="M0 17.302l1.138 1.061a1 1 0 001.364 0l8.715-8.132a1 1 0 000-1.462L2.502.637a1 1 0 00-1.364 0l-.355.33a1 1 0 000 1.463l6.793 6.339a1 1 0 010 1.462L0 17.301z" />
        </svg>
      </Link>
    </article>
  );
};

export default EventShortPreview;
