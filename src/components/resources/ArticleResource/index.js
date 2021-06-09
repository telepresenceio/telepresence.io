import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import styles from './styles.module.less';

const ArticleResource = ({ title, subtitle, content }) => (
  <div className={styles.ResourcePage}>
    <div className={styles.Container}>
      <div className={styles.Headline}>
        <h1 className={styles.Title}>{title}</h1>
        <p className={styles.Subtitle}>{subtitle}</p>
      </div>
      <div className={styles.Content}>
        <MDXRenderer>{content}</MDXRenderer>
      </div>
    </div>
  </div>
);

export default ArticleResource;
