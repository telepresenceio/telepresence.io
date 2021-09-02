import { noDemoClusterFound } from '../utils/demoCluster';
import { getBaseUrl } from '../utils/getBaseUrl';

const TELEPRESENCE_DEMO_CLUSTER_ID = 'telepresence-demo';
const MAX_RETRIES = 2;
const TIME_BETWEEN_RETRIES_MS = 500;

function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve(); }, ms);
  });
}

async function retry(fn) {
  let err;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await fn();
    } catch (e) {
      err = e;
      await sleep(TIME_BETWEEN_RETRIES_MS);
    }
  }
  throw new Error(`maximum retries exceeded: ${err}`);
}

const requestOptions = {
  method: 'GET',
  credentials: 'include',
  redirect: 'follow'
};

export async function loginUser(dispatch) {
  try {
    const apiUrl = getBaseUrl();
    const userInfo = await (await retry(() =>
      fetch(`${apiUrl}/userinfo`, requestOptions))).json();

    if (userInfo?.accountName) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: userInfo });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  } catch {
    dispatch({ type: 'LOGIN_FAILED' });
  }
}

export async function getUserServices(dispatch) {
  try {
    const apiUrl =getBaseUrl();

    const userServices = await (await retry(() =>
      fetch(`${apiUrl}/services`, requestOptions))).json();

    if (userServices) {
      if (userServices.length > 0) {
        dispatch({ type: 'USER_SERVICES_REQUEST', payload: userServices });
      }
    } else {
      dispatch({ type: 'USER_SERVICES_FAILED' });
    }
  } catch {
    dispatch({ type: 'USER_SERVICES_FAILED' });
  }
}

export async function getUserClusters(dispatch) {
  try {
    const apiUrl = getBaseUrl();

    const userClusters = await (await retry(() =>
      fetch(`${apiUrl}/clusters`, requestOptions))).json();

    if (userClusters && userClusters.length > 0) {
      dispatch({ type: 'USER_CLUSTERS_REQUEST', payload: userClusters });
    }
  } catch {
    dispatch({ type: 'USER_CLUSTERS_FAILED' });
  }
}

export async function triggerActivateDemoCluster(dispatch) {
  dispatch({type: 'DEMO_CLUSTER_METADATA_LOADING'});
}

export async function getDemoClusterMetadata(dispatch, claim) {
  try {
    const apiUrl = getBaseUrl();

    const response = await retry(() =>
      fetch(`${apiUrl}/democlusters/${TELEPRESENCE_DEMO_CLUSTER_ID}?autoClaim=${claim}`, requestOptions));

    if (response.ok) {
      const {externalIp, kubeConfig, agentApiKey, expirationDate, name} = await response.json();
      if (externalIp && kubeConfig && agentApiKey && expirationDate && name) {
        dispatch({
          type: 'DEMO_CLUSTER_METADATA_SUCCESS',
          payload: {
            externalIp,
            kubeConfig,
            agentApiKey,
            expirationDate,
            name
          }
        });
      } else if (response.status === 404){
        dispatch({type: 'DEMO_CLUSTER_METADATA_NOT_FOUND', payload: {errorCode: noDemoClusterFound}});
      }else {
        dispatch({type: 'DEMO_CLUSTER_METADATA_ERROR', payload: {errorCode: "error accessing data"}});
      }
    }
    else {
      const {errorCode} = await response.json();
      if (errorCode)
        dispatch({type: 'DEMO_CLUSTER_METADATA_ERROR', payload: {errorCode}});
      else {
        dispatch({type: 'DEMO_CLUSTER_METADATA_ERROR', payload: {errorCode: "error accesing data"}});
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}
