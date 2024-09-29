import React from 'react';
import CaseStudyTemplate from '../../components/CaseStudyTemplate';
import {caseStudy} from "./index";
import Layout from "../../components/Layout";

const VerloopPage: React.FC = () => {
	return (
		<Layout title="Verloop Case Study">
			<CaseStudyTemplate caseStudy={caseStudy("Verloop")}>
				<h2>
					<span className="purpleText">Ambassador:</span> Can you tell us about
					yourself and what your company does?
				</h2>

				<p>
					I am Piyush Mishra, Factotum at{' '}
					<a href="https://verloop.io">https://verloop.io</a>. Verloop is a
					conversational marketing platform, which is a fancy way of saying that
					we are a SaaS platform to run livechat with chatbots as a first class
					citizen.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What was your
					pre-Telepresence development experience?
				</h2>

				<p>
					Before we switched to Telepresence, we used to use kube-openvpn to
					forward network from our staging to local and manage environment
					variables separately with shell scripts. We didn’t need to forward the
					filesystem, so we never did that. Maintaining environment variables
					was a pain. Forwarding traffic from local to the pod was also a pain,
					requiring a lot of set up and configuration.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What is your workflow
					with Telepresence?
				</h2>

				<p>
					We have multiple services, in multiple repositories. Our engineers
					code locally with Telepresence. Then they check in the code into the
					correct source repository. Once the code is checked into the source
					repository, it is deployed into a staging environment, where it is
					tested before being deployed into production.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> Why did you choose
					Telepresence?
				</h2>

				<p>
					We were going to roll our own internal software to do pretty much what
					Telepresence does. We asked for similar solutions on the Kubernetes
					Slack channel and looked up on Google. I landed on your website and
					knew this was exactly what I wanted.
				</p>

				<h2>
					<span className="purpleText">Ambassador:</span> What benefits have you
					seen since adopting Telepresence?
				</h2>

				<p>
					0 wait on build times has been the biggest gain. We have builds from
					that take as long as 4.5 minutes. With kube-openvpn, it was possible
					to avoid building every single time, but it was cumbersome and time
					consuming to set up forwarding from our local to cluster. All of our
					wait times went to 0 the day we switched to Telepresence.
				</p>
			</CaseStudyTemplate>
		</Layout>
	);
}
export default VerloopPage;