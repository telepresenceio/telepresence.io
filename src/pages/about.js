import React from 'react';
import HubspotForm from 'react-hubspot-form';

import EasyLayout from '../components/EasyLayout';

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
						Telepresence is an open source tool that lets you run a single
						service locally, while connecting that service to a remote
						Kubernetes cluster.
					</p>
					<p>
						Telepresence was originally built by the team at Ambassador Labs,
						which builds open source development tools for Kubernetes, including
						Forge and Ambassador. The current list of maintainers of
						Telepresence are listed in the MAINTAINERS.md file.
					</p>
					<p>
						We welcome all community contributions. If you find a bug or a
						mistake in the documentation, you can help us out by submitting an
						issue or a pull request with a fix. If you have questions, join our
						active Slack community or contact us about paid support plans.
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
			</section>
		</EasyLayout>
	);
}
