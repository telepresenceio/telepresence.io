import React from 'react';

import styles from './styles.module.less';

const List = ({ title, items = [] }) => (
  <div>
    {title && <h3>{title}</h3>}
    <ul>
      {items.map((item, i) => (
        <li key={`list-${i}`}>{item}</li>
      ))}
    </ul>
  </div>
);

export default ({ left, right }) => (
  <div className={styles.wrapper}>
    {left && <List {...left} />}
    {right && <List {...right} />}
  </div>
);
