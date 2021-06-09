import React from 'react';
import classnames from 'classnames';
import styles from './styles.module.less';
import Link from '../Link';

import tutorialLinks from '../../../tutorials/tutorial-toc.yml';

const isCurrentPage = (location, item) => {
  const currentItemLink = item.link || '';
  const currentLocationPath = location.pathname || '';

  return currentItemLink.replace(/\//g, '') === currentLocationPath.replace(/\//g, '');
};

const TutorialFooter = ({ location }) => {
  // find the next and previous links based on tutorialLinks
  const currentIdx = tutorialLinks.findIndex(item => isCurrentPage(location, item));

  const prevLink = currentIdx > 0 ? tutorialLinks[currentIdx - 1] : null;
  const nextLink = currentIdx < tutorialLinks.length - 1 ? tutorialLinks[currentIdx + 1] : null;
  return (
    <div className={styles.Container}>
      { prevLink && <Link className={classnames(styles.Link, styles.Prev)} to={prevLink.link}>Previous: {prevLink.title}</Link> }
      { nextLink && <Link className={classnames(styles.Link, styles.Next)} to={nextLink.link}>Next: {nextLink.title}</Link> }
    </div>
  )};

export default TutorialFooter;
