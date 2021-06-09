import React from 'react';
import styles from './styles.module.less';

const AnnouncementBar = ({ content, hightlighted }) => (
  <aside className={`${styles.AnnouncementBar} ${hightlighted && styles.hightlighted}`}>
    <div className={styles.Content}>
      <p>
        {content}
      </p>
    </div>
  </aside>
)

export default AnnouncementBar;
