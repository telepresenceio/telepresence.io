import React from 'react';
import CaseStudyTemplate from '../../components/CaseStudyTemplate';
import {caseStudy} from "./index";
import Layout from "../../components/Layout";

const EngelVolkersPage: React.FC = () => {
	return (
		<Layout title="Engel & Völkers Case Study">
			<CaseStudyTemplate caseStudy={caseStudy("Engel & Völkers")}>
				<h2>
					<span className="purpleText">Ambassador:</span> Can you tell us about
					yourself and what your company does?
				</h2>

				<p>
					I am Christian Roggia, a DevOps Backend Engineer for the company{' '}
					<a href="https://evrealestate.com">Engel & Völkers</a>., one of the
					largest real estate company in the world and the most active in
					Europe. We are currently undergoing a migration process from legacy
					infrastructure to Google Cloud Platform and we are using Google
					Kubernetes Engine (GKE) heavily. This is where Telepresence has been a
					great help.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What was your
					pre-Telepresence development experience? What challenges did you face?
				</h2>

				<p>
					As the main developer of the synchronization services between the
					legacy and the new infrastructures, I faced many issues due to the
					nature of the legacy systems (i.e., dozens of different protocols,
					drivers, and APIs). Testing new code changes meant either waiting for
					a new deployment or manually setting up port-forwarding, SSH tunnels,
					and SSH proxies.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> How are you using
					Telepresence in your workflow today?
				</h2>

				<p>
					After we setup Telepresence and understood its main features we
					started to integrate it into our development process. Now we don't
					have to wait for new deployments and we can just run Telepresence for
					connecting and debugging our services. We also no longer need to
					configure manually proxies or tunnels of any kind - Telepresence will
					do it for us.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What benefits have you
					seen since adopting Telepresence?
				</h2>

				<p>
					The average time required for testing and debugging was dramatically
					reduced. The overall complexity for the development of services has
					decreased and we no longer need to maintain docker-compose files for
					local development.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> Do you have any advice
					for people looking to adopt Telepresence?
				</h2>

				<p>
					Try to adopt Telepresence for a few weeks, it will be immediately
					clear how much easier it is to develop (micro)services using
					Kubernetes and Docker technologies. We were skeptical at the beginning
					but now more and more developers inside our company are starting to
					use Telepresence in their daily routine. There are many advantages and
					the installation is extremely simple and lightweight.
				</p>
			</CaseStudyTemplate>
		</Layout>
	);
}
export default EngelVolkersPage;