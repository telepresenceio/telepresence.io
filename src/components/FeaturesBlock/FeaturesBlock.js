import React from 'react';

import Link from '../Link';

import styles from './styles.module.less';

const FEATURES = [
  {
    name: 'Core Concepts',
    icon: '/images/doc-icons/core-concepts.svg',
    description: <React.Fragment>Core concepts that cover Ambassador's architecture and how it should be used. <Link to='/concepts/overview'>Learn more</Link>.</React.Fragment>
  },
  {
    name: 'Edge Policy Console',
    icon: '/images/doc-icons/edge-policy-console.svg',
    description: <React.Fragment>Take advantage of the new user interface that makes configuration easier than ever. <Link to='/about/edge-policy-console'>Learn more</Link>.</React.Fragment>
  },
  {
    name: 'Guides',
    icon: '/images/doc-icons/guides.svg',
    description: <React.Fragment>Hands-on tutorials that walk through how to configure Ambassador for specific use cases. <Link to='/docs/guides'>Learn more</Link>.</React.Fragment>
  },
  {
    name: 'Need help?',
    icon: '/images/doc-icons/need-help.svg',
    description: <React.Fragment>If you have feedback or questions, please feel free to <Link to='http://a8r.io/Slack'>join our Slack</Link> or <Link to='https://github.com/datawire/ambassador/issues/new/choose'>open a pull request</Link>.</React.Fragment>
  },
  {
    name: 'References',
    icon: '/images/doc-icons/references.svg',
    description: <React.Fragment>Detailed documentation on configuring and managing all aspects of Ambassador. <Link to='/reference/overview'>Learn more</Link>.</React.Fragment>
  },

];

const FeaturesBlock = () => (
  <div className={styles.FeaturesBlock}>
    {
      FEATURES.map(feature => (
        <div className={styles.Feature}>
          <img alt={feature.name} src={feature.icon} />
          <div>
            <h4>{feature.name}</h4>
            <p>{feature.description}</p>
          </div>
        </div>
      ))
    }
  </div>
);

export default FeaturesBlock;