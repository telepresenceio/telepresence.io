import React, { Component } from 'react';
import classnames from 'classnames';

import Link from '../Link';

import styles from './styles.module.less';

export default class InstallAmbassadorPro extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    return (
      <div className={styles.Container}>
        <button className={styles.Toggle} onClick={this.toggle}>
          <p>Install Ambassador Pro</p>
          <span className={classnames(styles.Chevron, !this.state.open && styles.down)} />
        </button>
        <div className={classnames(!this.state.open && styles.closed)}>
          <p>
            Ambassador Pro is a commercial version of Ambassador that includes integrated Single Sign-On, powerful rate
            limiting, custom filters, and more. Ambassador Pro also uses a certified version of Ambassador OSS that
            undergoes additional testing and validation. 
          </p>
          <ol>
            <li>
              <p>Clone the Ambassador Pro configuration repository</p>
              <p>Ambassador Pro consists of a series of modules that communicate with Ambassador. The core Pro module
                is typically deployed as a sidecar to Ambassador. This means it is an additional process that runs on
                the same pod as Ambassador. Ambassador communicates with the Pro sidecar locally. Pro thus scales in
                parallel with Ambassador. Ambassador Pro also relies on a Redis instance for its rate limit service and
                several Custom Resource Definitions (CRDs) for configuration.
              </p>
              <p>
                For this installation, we'll start with a standard set of Ambassador Pro configuration files.
              </p>
              <div className="gatsby-highlight" data-language="text">
                <pre className="language-text">
                  <code className="language-text">
                    git clone https://github.com/datawire/pro-ref-arch
                  </code>
                </pre>
              </div>
            </li>
            <li>
              <p>License Key</p>
              <p>
                <code className="language-text">Copy env.sh.example</code> to <code className="language-text">env.sh</code>, and add your specific license key to the <code className="language-text">env.sh</code> file.
                If you don’t have a license key, you can request a <Link to="/products/free-trial">free 14-day trial key now</Link>.
              </p>
              <p><strong>Note:</strong> Ambassador Pro will not start without a valid license key.</p>
            </li>
            <li>
              <p>Deploy Ambassador Pro</p>
              <p>If you're on GKE, first, create the following <code className="language-text">ClusterRoleBinding</code>:</p>
              <div className="gatsby-highlight" data-language="text">
                <pre className="language-text">
                  <code className="language-text">
                    kubectl create clusterrolebinding my-cluster-admin-binding \{"\n"}
                    --clusterrole=cluster-admin \{"\n"}
                    --user=$(gcloud info --format="value(config.account)"){"\n"}
                  </code>
                </pre>
              </div>
              <p>Then, deploy Ambassador Pro:</p>
              <div className="gatsby-highlight" data-language="text">
                <pre className="language-text">
                  <code className="language-text">make apply-ambassador</code>
                </pre>
              </div>
              <p>This <code className="language-text">make</code> command will use <code className="language-text">kubectl</code> to deploy Ambassador Pro and a basic test configuration to the cluster.</p>
              <p>Verify that Ambassador Pro is running:</p>
              <div className="gatsby-highlight" data-language="text">
                <pre className="language-text">
                  <code className="language-text">
                    kubectl get pods | grep ambassador{"\n"}
                    ambassador-79494c799f-vj2dv            2/2       Running            0         1h{"\n"}
                    ambassador-pro-redis-dff565f78-88bl2   1/1       Running            0         1h{"\n"}
                  </code>
                </pre>
              </div>
              <p>
                <strong>Note:</strong> If you are not deploying in a cloud environment that supports the <code className="language-text">LoadBalancer</code>
                type, you will need to change the <code className="language-text">ambassador/ambassador-service.yaml</code> to a different service type
                (e.g., <code className="language-text">NodePort</code>).
              </p>
              <p>
                By default, Ambassador Pro uses ports 8081 and 8082 for rate-limiting and filtering, respectively. If
                for whatever reason those assignments are problematic (perhaps you <Link to="/reference/running/#running-as-non-root">set service_port</Link> to
                one of those), you can set adjust these by setting environment variables:
              </p>
              <ul>
                <li><code className="language-text">GRPC_PORT</code>: Which port to serve the RateLimitService on; <code className="language-text">8081</code> by default.</li>
                <li><code className="language-text">APRO_AUTH_PORT</code>: Which port to serve the filtering AuthService on; <code className="language-text">8082</code> by default.</li>
              </ul>
              <p>
                If you have deployed Ambassador with <Link to="/reference/running/#namespaces">AMBASSADOR_NAMESPACE</Link>, <Link to="/reference/running/#namespaces">AMBASSADOR_SINGLE_NAMESPACE</Link>, or <Link to="/reference/running/#ambassador_id">AMBASSADOR_ID</Link> set,
                you will also need to set them in the Pro container.
              </p>
            </li>
          </ol>
        </div>
      </div>
    );
  }
}
