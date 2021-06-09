import React from 'react';
import Helmet from 'react-helmet';
import { relativeToAbsUrl } from '../../utils/urls';
import Link from '../Link';

import styles from './breadcrumbs.module.less';

function getBreadcrumbsSchema(links) {
  return {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: links.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@id': relativeToAbsUrl(l.url),
        name: l.label,
      },
    })),
  };
}

export const Breadcrumbs = ({ links = [], title, width = 'lg' }) => {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(getBreadcrumbsSchema(links))}
        </script>
      </Helmet>
      <nav
        aria-label="Breadcrumbs"
        className={`${styles.wrapper} ${styles[`size_${width}`]}`}
      >
        {links.map((l) => (
          <Link to={l.url} target={l.newWindow && '_blank'}>
            {l.label}
          </Link>
        ))}
        {title && <span>{title}</span>}
      </nav>
    </>
  );
};
