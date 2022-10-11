import React from 'react';

import EasyLayout from '../components/EasyLayout';
import SocialCard from '../components/SocialCard';

import HeroIcon from '../assets/images/hero-image.svg';
import AmbassadorLogo from '../assets/images/ambassador-logo.svg';
import SlackLogo from '../assets/images/slack-logo.svg';
import GithubLogo from '../assets/images/github-logo.svg';

const SOCIAL_CARDS = [
	{
		logo: SlackLogo,
		title: 'Slack',
		link: 'http://a8r.io/slack',
		description:
			'Join our Slack to get answers to your questions and learn how others are using Telepresence.',
	},
	{
		logo: GithubLogo,
		title: 'Github',
		link: 'https://github.com/telepresenceio/telepresence/issues/new/choose',
		description:
			'Help with documentation, request a new feature, or submit a bug fix. No contribution is too small!',
	},
];

export default function CommunityPage({ location }) {
	return (
		<EasyLayout
			title="Community"
			location={location}
			description="Get involved and collaborate with our outstanding community of adopters and contributors on the Telepresence project"
		>
			<section className="communityPageSection purpleLight">
				<div className="joinSection">
					<h1>Join the Community</h1>
					<p>
						Developers worldwide are contributing to Telepresence. We’re
						building a vibrant community of contributors and related projects.
						We welcome any and all suggestions, new features, integrations, and
						documentation!
					</p>
				</div>
			</section>
			<section className="communityPageSection purpleDark">
				<div className="communityEcosystem">
					<div className="communityEcosystem-head">
						<h2>Ecosystem Projects Related to Telepresence</h2>
						<p>
							Developers worldwide are contributing to Telepresence. We’re
							building a vibrant community of contributors and related projects.
							We welcome any and all suggestions, new features, integrations,
							and documentation!
						</p>
					</div>
					<div className="communityEcosystem-hero">
						<img
							src={HeroIcon}
							className="heroImage"
							alt="Hero community"
							width="300"
							height="294"
						/>
						<div className="communityEcosystem-hero-descr">
							<img
								src={AmbassadorLogo}
								alt="Ambassador Logo"
								width="150"
								height="22"
							/>
							<p>
								Ambassador supports Telepresence for fast, efficent development
								of Kubernetes services for development teams. In addition to the
								features of Telepresence for local development, Ambassador
								includes a cloud dashboard and automatically generates preview
								URLs for easily sharing development environments with teammates.
								Ambassador makes it easy for developers to collaborate on
								Kubernetes microservices without disturbing production.
							</p>
							<a
								className="btn-purple-light"
								href="https://www.getambassador.io/products/telepresence/"
							>
								Learn more
							</a>
						</div>
					</div>
				</div>
			</section>
			<section className="communityPageSection purpleLight">
				<div className="communityPageSection-socialCards">
					<h2 className="communityPageSection-exploreTitle">
						Explore and Contribute to Our Networks
					</h2>
					<div className="communityPageSection-socialCards-container">
						{SOCIAL_CARDS.map((card, index) => (
							<SocialCard key={index} {...card} />
						))}
					</div>
				</div>
			</section>
		</EasyLayout>
	);
}
