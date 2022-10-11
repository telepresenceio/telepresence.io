import React from 'react';
import classnames from 'classnames';

import EasyLayout from '../../components/EasyLayout';
import CaseStudyCard from '../../components/CaseStudyCard';

import LogoBitnami from '../../assets/images/case-study/bitnami.svg';
import LogoEngelVolkers from '../../assets/images/case-study/engel-and-voelkers.png';
import LogoIrisTV from '../../assets/images/case-study/iris-tv.png';
import LogoIronclad from '../../assets/images/case-study/ironclad_logo.png';
import LogoSightMachine from '../../assets/images/case-study/sightmachine.png';
import LogoVerloop from '../../assets/images/case-study/Verloop-Logo-Horizontal-HD.png';

const CASE_STUDIES = [
	{
		logo: LogoBitnami,
		logoName: 'Bitnam',
		link: '/case-studies/bitnami',
	},
	{
		logo: LogoEngelVolkers,
		logoName: 'Engel & Völkers',
		link: '/case-studies/engel-volkers',
	},
	{
		logo: LogoIrisTV,
		logoName: 'IRIS.TV',
		link: '/case-studies/iris-tv',
	},
	{
		logo: LogoIronclad,
		logoName: 'Ironclad',
		link: 'https://articles.microservices.com/towards-a-better-service-development-story-c2fb9bdda6aa',
		isExternal: true,
	},
	{
		logo: LogoSightMachine,
		logoName: 'Sight Machine',
		link: '/case-studies/sight-machine',
	},
	{
		logo: LogoVerloop,
		logoName: 'Verloop',
		link: '/case-studies/verloop',
	},
];

export default function CaseStudiesPage({ location }) {
	return (
		<EasyLayout title="Case Studies" location={location}>
			<section className={classnames('caseStudiesPageSection', 'purpleLight')}>
				<h1>Case Studies</h1>
			</section>
			<section className="caseStudiesPageSection">
				<div className="caseStudiesPageSection-cardsContainer">
					{CASE_STUDIES.map((item, index) => (
						<CaseStudyCard key={index} {...item} />
					))}
				</div>
			</section>
			<section
				className={classnames('caseStudiesPageSection', 'purpleBackground')}
			>
				<div className="caseStudiesPageSection-contact">
					<h4>Have a Telepresence story to share?</h4>
					<p>Tell us your story</p>
					<a
						className="btn-purple-light"
						href="https://www.getambassador.io/contact-us/"
					>
						contact us
					</a>
				</div>
			</section>
		</EasyLayout>
	);
}
