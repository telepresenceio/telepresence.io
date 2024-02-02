import React from 'react';
import HubspotForm from 'react-hubspot-form';
import classnames from 'classnames';

import EasyLayout from '../components/EasyLayout';

import TelepresenceIcon from '../assets/images/telepresence-edgy.svg';
import CNCF_LOGO from '../assets/images/home/CNCF_logo.svg';
import LoopIcon from '../assets/images/home/Loop.svg';
import LeftArrowIcon from '../assets/images/home/Left_Arrow.svg';
import WrenchIcon from '../assets/images/home/Wrench.svg';
import EngelIcon from '../assets/images/case-study/engel-and-voelkers.png';
import PoshLogo from '../assets/images/home/Posh_logo.svg';
import PtcLogo from '../assets/images/home/ptc.svg';
import SaltLogo from '../assets/images/home/Salt_logo.svg';
import ManhattanLogo from '../assets/images/home/Manhattan_logo.svg';
import TPArchitectureLogo from '../assets/images/home/TP_Architecture.svg';

export default function HomePage({ location }) {
	return (
		<EasyLayout
			title="Home"
			location={location}
			description="Telepresence: a local development environment for a remote Kubernetes cluster"
		>
			<section className={classnames('homeSection', 'purpleLight')}>
				<div className="homeSection_header">
					<h1>Telepresence</h1>
					<p>
						Fast, local development for Kubernetes and OpenShift Microservices
					</p>
					<div className="homeSection_buttons">
						<a href="/docs/latest/quick-start/" className="btn-purple-light">
							get started
						</a>
					</div>
					<div className="homeSection_foundation">
						<img
							className="cncf-logo"
							alt="Cloud Native Computing Foundation"
							src={CNCF_LOGO}
						/>
						<p>
							Telepresence is a{' '}
							<a href="https://www.cncf.io/">
								Cloud Native Computing Foundation
							</a>{' '}
							Sandbox project created by the team at{' '}
							<a
								href="https://www.getambassador.io/"
								target="_blank"
								rel="noreferrer"
							>
								Ambassador Labs
							</a>
						</p>
					</div>
				</div>
				<div className="homeSection_image">
					<img
						src={TelepresenceIcon}
						alt="Telepresence Edgy icon"
						width="300"
						height="300"
					/>
				</div>
			</section>
			<section className="homeSectionWhy">
				<h2>Why Telepresence?</h2>
				<div className="homeSectionWhy_cardContainer">
					<div className="homeSectionWhy_cardContainer_card">
						<img src={LoopIcon} alt="Loop icon" width="50" height="50" />
						<h3>Accelerate Inner Dev Loop</h3>
						<p>
							Kubernetes was supposed to make your team faster, but now
							everytime you make a code change you have to wait for containers
							to build, be pushed to registry, and deployed. With Telepresence,
							you can make changes to your service as if you're developing
							locally, without having to run all the dependencies on your local
							machine.
						</p>
					</div>
					<div className="homeSectionWhy_cardContainer_card">
						<img src={LeftArrowIcon} alt="Loop icon" width="50" height="50" />
						<h3>Shift Testing Left</h3>
						<p>
							You want to catch errors before they get shipped to production,
							but to do that you need a realistic development environment and
							with Kubernetes, those can be expensive. Telepresence lets you
							connect the copy of your service locally to your remote
							dependencies, so you can test like your laptop is in your cluster.
						</p>
					</div>
					<div className="homeSectionWhy_cardContainer_card">
						<img src={WrenchIcon} alt="Loop icon" width="50" height="50" />
						<h3>Use Your Existing Workflow</h3>
						<p>
							Missing your favorite code editor, debugger, or profiler? Anything
							that runs on your laptop works with Telepresence - even when
							you're working on a service running in Kubernetes.
						</p>
					</div>
				</div>
			</section>
			<section className={classnames('purpleLight', 'homeSectionUsedBy')}>
				<h2>Used by</h2>
				<div className="homeSectionUsedBy_logosContainer">
					<div className="homeSectionUsedBy_logosContainer_logo">
						<img
							src={EngelIcon}
							alt="Engel and voelkers logo"
							width={140}
							height={36}
						/>
					</div>
					<div className="homeSectionUsedBy_logosContainer_logo">
						<img src={PoshLogo} alt="Posh logo" width={83} height={40} />
					</div>
					<div className="homeSectionUsedBy_logosContainer_logo">
						<img src={PtcLogo} alt="PTC logo" width={102} height={40} />
					</div>
					<div className="homeSectionUsedBy_logosContainer_logo">
						<img src={SaltLogo} alt="Salt logo" width={125} height={40} />
					</div>
					<div className="homeSectionUsedBy_logosContainer_logo">
						<img
							src={ManhattanLogo}
							alt="Manhattan logo"
							width={140}
							height={27}
						/>
					</div>
				</div>
			</section>
			<section className="homeSectionHowWork">
				<h2>How does it work?</h2>
				<p className="homeSectionHowWork_subheader">
					Telepresence consists of two core architecture components: the
					client-side telepresence binary (CLI on your workstation) and the
					cluster-side traffic-manager and traffic-agent (on the remote
					Kubernetes cluster).
				</p>
				<div className="homeSectionHowWork_container">
					<img
						src={TPArchitectureLogo}
						alt="TP Architecture Logo"
						width={300}
						height={218}
					/>
					<div className="homeSectionHowWork_container_content">
						<p>
							Telepresence consists of two core architecture components: the
							client-side (CLI) telepresence binary and (Kubernetes)
							cluster-side traffic-manager and traffic-agent.
						</p>
						<div className="homeSectionHowWork_container_content_items">
							<div>
								<div className="circle">1</div>
								<p>
									The `telepresence connect` command utilizes the
									traffic-manager to establish a two-way (proxied) tunnel
									between your local development machine and the cluster. Now
									you can access remote K8s Service as if they were running
									locally.
								</p>
							</div>
							<div>
								<div className="circle">2</div>
								<p>
									Running `telepresence intercept service-name` triggers the
									traffic-manager to install a traffic-agent proxy container
									that runs within the Pods associated with the target Services.
									This can route remote traffic to your local dev machine for
									dev and test.
								</p>
							</div>
						</div>
						<p>
							To find out more about the Telepresence Architecture, check out
							the{' '}
							<a href="https://www.getambassador.io/docs/telepresence-oss/latest/reference/architecture/">
								docs
							</a>{' '}
							or join us in <a href="http://a8r.io/slack">Slack</a>.
						</p>
						<a href="/docs/latest/quick-start/" className="btn-purple-light">
							get started
						</a>
					</div>
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
						The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, 
						please see our <a href="https://www.linuxfoundation.org/legal/trademark-usage">Trademark Usage page</a>.
					</p>
				</div>
			</section>
		</EasyLayout>
	);
}
