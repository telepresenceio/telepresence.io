export const initialStateApp = {
  userInfo: null,
  userServices: null,
  userClusters: null,
  demoClusterMetadata: null,
  loading: false,
  loadingMetadata: false,
  loginError: false,
  servicesError: false,
  clustersError: false,
  demoClusterMetadataError: null,
};

export const AppReducer = (currentState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...currentState,
        loading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...currentState,
        userInfo: action.payload,
        loading: false,
      };
    case 'LOGIN_FAILED':
      return {
        ...currentState,
        loginError: true,
      };
    case 'LOGOUT':
      return {
        ...initialStateApp,
      };
    case 'USER_SERVICES_REQUEST':
      return {
        ...currentState,
        servicesError: false,
        userServices: action.payload,
      };
    case 'USER_SERVICES_FAILED':
      return {
        ...currentState,
        servicesError: true,
      };
    case 'USER_CLUSTERS_REQUEST':
      return {
        ...currentState,
        clustersError: false,
        userClusters: action.payload,
      };
    case 'USER_CLUSTERS_FAILED':
      return {
        ...currentState,
        clustersError: true,
      };
    case 'DEMO_CLUSTER_METADATA_LOADING':
      return {
        ...currentState,
        loadingMetadata: true,
      };
    case 'DEMO_CLUSTER_METADATA_SUCCESS':
      return {
        ...currentState,
        demoClusterMetadata: {
          agentApiKey: action.payload.agentApiKey,
          externalIp: action.payload.externalIp,
          kubeConfig: action.payload.kubeConfig,
          expirationDate: action.payload.expirationDate,
          name: action.payload.name
        },
        loading: false,
        loadingMetadata: false,
        demoClusterMetadataError: null,
      };
    case 'DEMO_CLUSTER_METADATA_NOT_FOUND':
      return {
        ...currentState,
        loading: false,
        loadingMetadata: false,
        demoClusterMetadataError: null,
      };
    case 'DEMO_CLUSTER_METADATA_ERROR':
      return {
        ...currentState,
        loading: false,
        loadingMetadata: false,
        demoClusterMetadataError: {
          errorCode: action.payload.errorCode,
        },
      };
    default:
      throw new Error(`Unhandle action type: ${action.type}`);
  }
};
