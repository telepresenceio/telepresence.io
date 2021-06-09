import React from 'react';

import styles from './linksTable.module.less';

import RichText from '../RichText/RichText';
import Link from '../Link/Link';

const LinksTable = ({ columns = [] }) => (
  <div className={styles.container}>
    {columns.map((column) => (
      <div className={styles.column} key={column._key}>
        <h2 className={styles.header}>
          {column.url ? (
            <Link to={column.url}>{column.title}</Link>
          ) : (
            column.title
          )}
        </h2>
        {column.body && (
          <RichText
            className={styles.content}
            renderContainerOnSingleChild={true}
            blocks={column.body}
          />
        )}
      </div>
    ))}
  </div>
);

export default LinksTable;
