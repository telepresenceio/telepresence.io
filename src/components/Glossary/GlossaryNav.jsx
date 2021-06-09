import React from 'react';

import styles from './glossaryNav.module.less';
import Link from '../Link';

export const GlossaryNav = ({ glossaryData, isIndexPage }) => {
  const basePath = isIndexPage
    ? '#section-'
    : '/learn/kubernetes-glossary#section-';
  return (
    <nav className={`${styles.nav} glossary-nav`}>
      <ul className={`${styles.ul} glossary-ul`}>
        {glossaryData.map(({ letter, words }) => {
          if (!Array.isArray(words) || !words.length) {
            return (
              <li>
                <div>{letter}</div>
              </li>
            );
          }
          return (
            <li>
              <Link to={basePath + letter}>{letter}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
