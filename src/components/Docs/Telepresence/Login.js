import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import * as styles from './login.module.less';
import {
  getDemoClusterMetadata,
  loginUser,
  triggerActivateDemoCluster,
  useAppDispatch,
  useAppState,
} from '../../../context';
import { getBaseUIUrl } from '../../../utils/getBaseUrl';
import Icon from '../../Icon';
import moment from 'moment';

const Login = ({ urlParams, origin }) => {
  const { userInfo, demoClusterMetadata, loadingMetadata } = useAppState();
  const dispatch = useAppDispatch();
  const [activatingDemoCluster, setActivatingDemoCluster] = useState(false);
  const params = urlParams ? `?${urlParams}` : ''
  const loginUrl = `${getBaseUIUrl()}/login-popup${params}`;
  const claim = true;
  const noClaim = false;

  const login = () => {
    let loginPopup = window.open(loginUrl,
      'ambassador-cloud-demo-cluster',
      'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=550,height=750');
    let loop = setInterval(function () {
      if (loginPopup.closed) {
        clearInterval(loop);
        loginUser(dispatch);
      }
    }, 1000);
  };

  const loginAndActivate = (e) => {
    e.preventDefault();
    login();
    activateDemoCluster(e);
  }

  const activateDemoCluster = (e) => {
    e.preventDefault();
    setActivatingDemoCluster(true);
  }

  useEffect(() => {
    getDemoClusterMetadata(dispatch, noClaim, origin);
  }, [dispatch, noClaim, origin]);

  useEffect(() => {
    if (!demoClusterMetadata?.externalIp && userInfo?.username && setActivatingDemoCluster)
      triggerActivateDemoCluster(dispatch);
  }, [demoClusterMetadata, dispatch, userInfo]);

  useEffect(() => {
    if (loadingMetadata && userInfo?.username && activatingDemoCluster)
      getDemoClusterMetadata(dispatch, claim, origin);
  }, [loadingMetadata, activatingDemoCluster, userInfo, dispatch, claim, origin]);

  const render = () => {
    if (!userInfo?.username) {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return (<><a href="#" onClick={loginAndActivate} className="getClusterBtn">Get a Free Remote Cluster</a><br />Sign
        in to Ambassador Cloud to activate your demo cluster.</>);
    } else if (demoClusterMetadata?.agentApiKey && demoClusterMetadata?.externalIp && demoClusterMetadata?.expirationDate) {
      return (<div className={classNames(styles.loginSuccessContainer)}>
        <Icon name="tada" className={classNames(styles.loginSuccessIcon)} />
        <span>Your free remote cluster is ready! You can continue with the following steps until it
          expires {moment(demoClusterMetadata.expirationDate).fromNow()}.</span>
      </div>);
    } else {
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      return (<><a href="#" onClick={activateDemoCluster} className="getClusterBtn">Get a Free Remote Cluster</a></>);
    }
  };

  return (
    render()
  );
}

export { Login };
