import React from 'react';
import classnames from 'classnames';
import styles from './styles.module.less';
import Link from '../Link';

import tutorialLinks from '../../../tutorials/tutorial-toc.yml';

const isActive = (location, item) => {
  const currentItemLink = item.link || '';
  const currentLocationPath = location.pathname || '';

  return currentItemLink.replace(/\//g, '') === currentLocationPath.replace(/\//g, '');
};

const TutorialTOC = ({ location }) => (
  <div className={styles.Container}>
    <span>TUTORIALS</span>
    {
      tutorialLinks.map(
        item => <Link key={item.link} className={classnames(styles.Link, isActive(location, item) && styles.active)} to={item.link}>{item.title}</Link>
      )
    }
  </div>
);

export default TutorialTOC;
