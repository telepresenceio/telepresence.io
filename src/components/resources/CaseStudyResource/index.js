import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';
import Link from '../../Link';

import './case-study-styles.less';
import {MDXRenderer} from "gatsby-plugin-mdx";

const ambassadorLogo = require('../../../images/ambassador-logo.svg');

const CaseStudyResource = (
  {
    content,
    subtitle,
    logo,
    industry,
    size,
    quote
  }
) => (
  <div className={styles.CaseStudyPage}>
    <div className={styles.Hero}>
      <div className={styles.Container}>
        <strong>Case Study</strong>
        <div className={styles.Title}>
          <img alt="Logo" src={logo}/>
          <span>+</span>
          <img alt="Ambassador Logo" src={ambassadorLogo}/>
        </div>
        <p className={styles.Subtitle}>{subtitle}</p>
        <img alt="Blackbird" className={styles.Mascot} src="/images/hero-penguin.svg" />
      </div>
    </div>
    <div className={styles.Container}>
      <div className={styles.Row}>
        <div className={styles.Content}>
          <MDXRenderer>{content}</MDXRenderer>
          <div className={classnames(styles.CTA, styles.Stretch)}>
            <p>Find out what Ambassador can do for you</p>
            <Link className={styles.Button} to="/docs/edge-stack/latest/tutorials/getting-started/">Get Started</Link>
          </div>
        </div>
        <div className={styles.Sidebar}>
          <div className={styles.CompanyInfo}>
            <img alt="Logo" src={logo} />
            <div><strong>Industry:</strong> {industry}</div>
            <div><strong>Size:</strong> {size}</div>
          </div>
          <div className={styles.Quote}>
            <span className={styles.TopQuotation}>“</span>
            <p>{quote}</p>
            <span className={styles.BottomQuotation}>”</span>
          </div>
          <div className={styles.CTA}>
            <p>Find out what Ambassador can do for you</p>
            <Link className={styles.Button} to="/docs/edge-stack/latest/tutorials/getting-started/">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CaseStudyResource;
