import Alert from '@material-ui/lab/Alert';
import React from 'react';

import { useAppState } from '../../context';

const ExpirationDate = () => {
  const {demoClusterMetadata} = useAppState();

  const render = ()=> {
    if (demoClusterMetadata?.expirationDate) {
      let dateTime = new Date(demoClusterMetadata?.expirationDate);
      return (<Alert severity="info">The demo cluster expires at {dateTime.toString()}</Alert>);
    }
    else
      return ("");
  };

  return (  render() );
}

export { ExpirationDate }
