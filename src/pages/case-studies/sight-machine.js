import React from 'react';

import EasyLayout from '../../components/EasyLayout';
import CaseStudyTemplate from '../../components/CaseStudyTemplate';

export default function SightMachinePage({ location }) {
	return (
		<EasyLayout title="Sight Machine Case Study" location={location}>
			<CaseStudyTemplate caseStudy="Sight Machine">
				<h2>
					<span className="purpleText">Ambassador:</span> Can you tell us about
					yourself and what your company does?
				</h2>

				<p>
					<a href="https://sightmachine.com/" target="_blank" rel="noreferrer">
						Sight Machine
					</a>{' '}
					started six years ago with the vision to apply AI and digital
					technology to manufacturing. Sight Machine is the category leader for
					manufacturing analytics and used by Global 500 companies to make
					better, faster decisions about their operations.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What was your
					pre-Telepresence development experience? What challenges did you face?
				</h2>

				<p>
					We run a pretty varied stack, including Python, PostgreSQL, and
					MongoDB. All of our software runs in Kubernetes. We like the
					affordances that cloud resources provide, but we were having
					challenges with rapid iteration for remote debugging/development. Our
					engineers had a need to attach their IDE (typically PyCharm) to the
					Kubernetes cluster.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What benefits have you
					seen since choosing Telepresence?
				</h2>

				<p>
					Telepresence was really the only tool that addressed this problem. Our
					engineers and data scientists can now write code in PyCharm, while all
					the computation happens in the cloud, aligned with the rest of our
					automation and infrastructure. The entire process of editing code,
					committing and pushing changes, waiting for the build, deploying has
					gone away-- allowing for more rapid development.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> Do you have any advice
					for people looking to adopt Telepresence?
				</h2>

				<p>
					For companies looking to align the benefits of local development (e.g.
					fast iteration, customizable dev tools) with remote Kubernetes
					clusters, Telepresence is a great choice. We've extended the
					Telepresence automation with our own bash script that simplifies the
					Telepresence command line, so that the data scientists can type a
					single command and it will do the right thing.
				</p>
			</CaseStudyTemplate>
		</EasyLayout>
	);
}
