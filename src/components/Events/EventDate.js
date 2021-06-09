import React from 'react';
import { getFormattedDate } from '../../utils/date';
import styles from './eventDate.module.less';

export const EventDate = ({ startDate, endDate }) => {
  return (
    <div className={styles.date}>
      {/* Visually hidden text for screen readers */}
      <span className="visually-hidden">Event happening on </span>
      {getFormattedDate(startDate, endDate)}
    </div>
  );
};

export default EventDate;
