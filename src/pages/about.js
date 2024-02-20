import React from 'react';
import HubspotForm from 'react-hubspot-form';

import EasyLayout from '../components/EasyLayout';
import TelepresenceIcon from '../assets/images/telepresence-edgy.svg';

export default function AboutPage({ location }) {
	return (
		<EasyLayout
			title="About"
			location={location}
			description="Telepresence: a local development environment for a remote Kubernetes cluster"
		>
			<section className="aboutPageContainer">
				<div className="aboutPageContainer-item">
					<h1>About</h1>
					<p>
						Telepresence is an open source tool for Kubernetes application
						developers that lets you run a single service locally while
						connecting that service to a remote Kubernetes cluster.
					</p>
					<p>
						Telepresence is a CNCF sandbox tool built by the team at{' '}
						<a href="https://www.getambassador.io/">Ambassador</a> Labs, the
						creators of Emissary-ingress (Kubernetes-native API gateway powered
						by Envoy Proxy). The team at Ambassador Labs is committed to helping
						development teams build faster & ship safer on Kubernetes.
					</p>
					<p>
						We welcome all community contributions. If you find a bug or a
						mistake in the documentation, you can help us out by submitting an
						issue or a pull request with a fix. If you have questions, join our
						active <a href="http://a8r.io/slack">Slack community</a> or{' '}
						<a href="https://www.getambassador.io/contact-us">contact us</a>{' '}
						about paid support plans.
					</p>
				</div>
				<div className="aboutPageContainer-item">
					<img
						src={TelepresenceIcon}
						alt="Telepresence Edgy icon"
						width="300"
						height="300"
					/>
				</div>
			</section>
      <section className="aboutPageStayUpdated">
        <h4>Stay Updated</h4>
        <p>
          Telepresence is under active development. Subscribe to get updates and
          announcements:
        </p>
        <div className="aboutPageHubspotForm">
          <HubspotForm
            portalId="485087"
            formId="956287a4-7614-486b-91bd-28c9a91949cb"
          />
        </div>
        <div className="trademarkUsage">
          <p>
            The Linux Foundation has registered trademarks and uses
            trademarks.
            For a list of trademarks of The Linux Foundation,
            please see our <a
            href="https://www.linuxfoundation.org/legal/trademark-usage">Trademark
            Usage page</a>.
          </p>
        </div>
      </section>
    </EasyLayout>
  );
}
