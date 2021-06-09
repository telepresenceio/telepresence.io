import React from 'react';

import styles from './linksSection.module.less';

import RichText from '../RichText/RichText';

const LinksSection = ({ title, anchorId, body, rows = [] }) => (
  <div id={anchorId} className={styles.wrapper}>
    <h2>{title}</h2>
    {body && (
      <RichText
        renderContainerOnSingleChild={true}
        className={styles.sectionBody}
        blocks={body}
      />
    )}
    {rows.map((row) => (
      <div id={row.anchorId} className={styles.section} key={row._key}>
        <h3>{row.title}</h3>
        <div className={styles.sectionContent}>
          {row.body && <RichText blocks={row.body} />}
        </div>
      </div>
    ))}
  </div>
);

export default LinksSection;
