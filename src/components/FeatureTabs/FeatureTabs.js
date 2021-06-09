import React, { Component } from 'react';
import classnames from 'classnames';
import Link from '../Link';

import styles from './styles.module.css';

const TABS = [
  {
    name: 'Routing',
    icon: '/images/routing-icon.svg',
    content: (
      <p>
        Map services to arbitrary URLs in a single, declarative YAML file.
        Configure routes with CORS support, circuit breakers, timeouts, and
        more. Replace your Kubernetes ingress controller. Route gRPC,
        WebSockets, or HTTP. Load balance between your different services.
      </p>
    ),
  },
  {
    name: 'Authentication',
    icon: '/images/authentication-icon.svg',
    content: (
      <p>
        Easily integrate your own authentication service with Ambassador for
        <Link to="https://www.getambassador.io/user-guide/auth-tutorial">
          per-request authentication
        </Link>
        .
      </p>
    ),
  },
  {
    name: 'Fast',
    icon: '/images/fast-icon.svg',
    content: (
      <p>
        Ambassador uses the high performance
        <Link to="https://www.envoyproxy.io">Envoy Proxy</Link>, which processes
        over 2M requests/second at Lyft. Ambassador runs as a sidecar to Envoy,
        ensuring that you get raw Envoy performance.
      </p>
    ),
  },
  {
    name: 'Highly Available',
    icon: '/images/highly-available-icon.svg',
    content: (
      <p>
        Ambassador uses the proven resilience capabilities of Kubernetes to
        ensure high availability. For example, Kubernetes is responsible for
        auto-restarting, auto-scaling, and updating (via a RollingUpdate)
        Ambassador. Unlike many other API gateways, Ambassador has no database
        -- it relies on ConfigMap to store state.
      </p>
    ),
  },
  {
    name: 'Self-service configuration',
    icon: '/images/configure-icon.svg',
    content: (
      <p>
        Easily and safely configure Ambassador without going through operations
        -- Ambassador is configured using Kubernetes annotations.
      </p>
    ),
  },
];

export default class FeatureTabs extends Component {
  constructor() {
    super();
    this.state = {
      currentTab: 0,
    };
  }

  switchTab = i => {
    this.setState({
      currentTab: i,
    });
  };

  render() {
    return (
      <section className={classnames(styles.FeatureTabs, 'bg-blue')}>
        <div className="container">
          <ul className={styles.AboutTabs}>
            {TABS.map((tab, i) => (
              <li
                key={i}
                onClick={() => this.switchTab(i)}
                className={classnames(
                  styles.Tab,
                  this.state.currentTab === i && styles.active,
                )}
              >
                <img alt={tab.name} src={tab.icon} />
                <span>{tab.name}</span>
              </li>
            ))}
          </ul>
          <div
            className={classnames(
              styles.TabContent,
              'font-light',
              'text-white',
            )}
          >
            {TABS.map((tab, i) => (
              <div
                key={i}
                className={classnames(
                  this.state.currentTab === i && styles.active,
                )}
              >
                {tab.content}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
}
