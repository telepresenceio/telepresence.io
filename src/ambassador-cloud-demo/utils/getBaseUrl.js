const API_URL = 'https://app.getambassador.io/cloud/api';
const BETA_API_URL = 'https://beta-app.datawire.io/cloud/api';
const MOCK_SERVER_URL = 'http://localhost:9000'
const UI_URL = 'https://app.getambassador.io/cloud';
const BETA_UI_URL = 'https://beta-app.datawire.io/cloud';
const PROD_DOCS_DOMAIN = {'www.telepresence.io': API_URL, 'archive.getambassador.io': API_URL};
const PROD_DOCS_DOMAIN_UI = {'www.telepresence.io': UI_URL, 'archive.getambassador.io': UI_URL};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    if (window?.location?.hostname === 'localhost') {
      return MOCK_SERVER_URL;
    }
    return PROD_DOCS_DOMAIN[window?.location.host] || BETA_API_URL;
  } else {
    return BETA_API_URL;
  }
}

const getBaseUIUrl = ()=> {
  if ( typeof window !== "undefined")
    return PROD_DOCS_DOMAIN_UI[window?.location.host] || BETA_UI_URL;
  else
    return UI_URL;
}

export {getBaseUrl, getBaseUIUrl};
