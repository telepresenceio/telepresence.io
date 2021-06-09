import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';

export default ({ title, headers = [], rows = [] }) => {
  return (
    <section className={styles.container}>
      {title && <h2>{title}</h2>}
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th>
              <span className="visually-hidden">Feature</span>
            </th>
            {headers.map((title) => (
              <th key={title} className={styles.headerCell}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ title, highlighted, cells = [] }) => (
            <tr
              key={title}
              className={classnames(
                styles.row,
                highlighted && styles.rowHighlighted,
              )}
            >
              {/* Row header */}
              <td className={styles.headerCell}>{title}</td>
              {/* Row cells */}
              {cells.map(({ availability }, i) => (
                <td className={styles.cell}>
                  <div
                    className={classnames(
                      styles.indicator,
                      availability === 'partial' && styles.half,
                      availability === 'unavailable' && styles.empty,
                    )}
                  />
                  {/* Will show up on mobile */}
                  <div className={styles.headerLabel}>{headers[i]}</div>
                  {/* Text for screen readers */}
                  <span className={styles.visuallyHidden}>{availability}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
