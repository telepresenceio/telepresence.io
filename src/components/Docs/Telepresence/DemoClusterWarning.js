import React from 'react';
import classNames from 'classnames';

import { useAppState } from '../../../context';

import Hand from '../../../../static/images/hand.inline.svg';
import styles from './DemoClusterWarning.module.less';

const DemoClusterWarning = () => {
  const { demoClusterMetadata } = useAppState();

  if (demoClusterMetadata) {
    return null;
  }
  return (
    <div className={classNames(styles.container, 'warning-message')}>
      <div className={styles.handCont}>
        <Hand />
      </div>
      <div className={styles.message}>
        <strong>Wait!</strong>
        {` The rest of this quick start requires a remote Kubernetes cluster.
        Before continuing, activate a `}
        <a href="#1-get-a-free-remote-cluster">free demo cluster</a>
        {' in '}
        <strong>step 1 </strong> above.
      </div>
    </div>
  );
}

export { DemoClusterWarning };
