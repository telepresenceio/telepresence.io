import React from 'react';

import styles from './nextEvents.module.less';
import OldEventCard from './OldEventCard';

const NextEvents = ({ next }) => {
  if (!next || !Array.isArray(next.nodes) || !next.nodes.length) {
    return null;
  }
  return (
    <aside className={styles.wrapper}>
      <h2>Next events</h2>
      <div className={styles.container}>
        {next.nodes.map((item) => (
          <OldEventCard key={item._id} {...item} />
        ))}
      </div>
    </aside>
  );
};

export default NextEvents;
