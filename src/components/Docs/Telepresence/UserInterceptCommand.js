import React from 'react';

import { useAppState, useAppDispatch, getUserServices } from '../../../context';
import { useInterval } from '../../../hooks';
import { web, voting } from '../../../utils/telepresenceIntercept';
import { default as CodeBlock } from '../../CodeBlock';

const languagesData = {
  'demo-node': {
    service: web,
    port: '--port 8080',
  },
  go: {
    service: voting,
    port: '--port 8081:8080',
  },
}

const UserInterceptCommand = ({ language = 'demo-node' }) => {
  const SERVICES_REFRESH_INTERVAL = 5_000;
  const dispatch = useAppDispatch();
  const { userInfo, userServices } = useAppState();
  const langData = languagesData[language];

  const userIntercept = userServices?.find((service) => service.intercepts && service.intercepts[service.intercepts.length - 1]?.name === langData.service);

  useInterval(() => {
    if (userInfo && !userIntercept) {
      getUserServices(dispatch);
    }
  }, SERVICES_REFRESH_INTERVAL);

  const interceptId = userIntercept?.intercepts[userIntercept?.intercepts?.length - 1]?.interceptID;
  const previewURL = userIntercept?.intercepts[userIntercept?.intercepts?.length - 1]?.previewURL?.url;
  const interceptCommand = `$ telepresence intercept ${langData.service} ${langData.port}`;

  const intercepted = interceptId && previewURL ? `\tUsing deployment ${langData.service}\n` +
    "\tintercepted\n" +
    `\t    Intercept name         : ${langData.service}\n` +
    "\t    State                  : ACTIVE\n" +
    "\t    Destination : 127.0.0.1: 8080\n" +
    "\t    Service Port Identifier: http\n" +
    "\t    Intercepting           : HTTP requests that match all of:\n" +
    `\t      header("x-telepresence-intercept-id") ~= regexp("
  ${interceptId}")\n` +
    `\t    Preview URL            : ${previewURL}\n` +
    "\t    Layer 5 Hostname       : ambassador.ambassador\n" : ""

  return (<CodeBlock className="console">{
    interceptCommand + "\n\n" +
    "\tTo create a preview URL, telepresence needs to know how cluster\n" +
    "\tingress works for this service. Please Select the ingress to use.\n" +
    "\t1/4: What's your ingress' layer 3 (IP) address?\n" +
    "\t     You may use an IP address or a DNS name (this is usually a\n" +
    `\t     "service.namespace" DNS name).\n` +
    "\t     [default: ambassador.ambassador]:\n" +
    "\t2/4: What's your ingress' layer 4 address (TCP port number)?\n" +
    "\t     [default: 80]:\n" +
    "\t3/4: Does that TCP port on your ingress use TLS (as opposed to cleartext)?\n" +
    "\t     [default: n]:\n" +
    "\t4/4: If required by your ingress, specify a different layer 5 hostname\n" +
    `\t     (TLS-SNI, HTTP "Host" header) to access this service.\n` +
    "\t     [default: ambassador.ambassador]:\n" +
    `${intercepted}`
  }</CodeBlock>);
};

export { UserInterceptCommand };
