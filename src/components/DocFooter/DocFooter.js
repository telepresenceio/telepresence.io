import React from 'react';

import styles from './styles.module.less';

import GithubIcon from '../../../static/images/documentation/github-icon.inline.svg';

import Link from '../Link';

const DocFooter = ({ page, branch }) => (
  <aside className={styles.DocFooter}>
    <Link
      to={`https://github.com/datawire/ambassador-docs/tree/master/docs/${branch}/${
        page ? page.parent.relativePath.replace(/^early-access\//, '').split("/").slice(2,).join("/") : ''
      }`}
    >
      <GithubIcon />
      Edit this page on GitHub
    </Link>
  </aside>
);

export default DocFooter;
