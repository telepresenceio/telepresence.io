import React from 'react';
import styles from './styles.module.less';

const TutorialHeader = ({ title, category, readingTime, technologiesUsed }) => (
  <div className={styles.Container}>
    <h1 className={styles.Title}>{title}</h1>
    <strong className={styles.Category}>{category}</strong>
    <div className={styles.MetaContainer}>
      <div className={styles.Metadata}>
        <span>Time to complete</span>
        <span>
          <img alt="time" src="/images/time-icon.svg" />
          {readingTime}
        </span>
      </div>
      <div className={styles.Metadata}>
        <span>Technologies Used</span>
        <span>{technologiesUsed}</span>
      </div>
    </div>
  </div>
);

export default TutorialHeader;
