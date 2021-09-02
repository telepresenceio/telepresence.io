import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { useAppState } from '../../context';

const DemoClusterMetadataError = ({children}) => {
  const { demoClusterMetadataError } = useAppState();
  const poolDepletedError = "DEMO_CLUSTER_DEPLETED";

  const render = () => {
    if (demoClusterMetadataError){
      switch (demoClusterMetadataError.errorCode){
        case poolDepletedError:{
          return (<Alert severity="error">Our demo pool is temporarily depleted. Please try again in an hour.</Alert>);
        }
        default:
          return (<Alert severity="error">There was something wrong. Please, <a href="/contact-us">contact us.</a></Alert>)
      }
    }
    return (<></>);
  }

  return (render());
};

export { DemoClusterMetadataError };
