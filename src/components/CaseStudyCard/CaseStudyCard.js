import React from 'react';
import './style.less';

const CaseStudyCard = ({ logo, logoName, link, isExternal }) => {
	const content = (
		<>
			<img src={logo} alt={`${logoName} logo`} />
			<div className="card-case-study-descr">
				<p>View case study</p>
			</div>
		</>
	);

	if (isExternal) {
		return (
			<a
				className="card-case-study"
				href={link || ''}
				target="_blank"
				rel="noreferrer"
			>
				{content}
			</a>
		);
	}

	return (
		<a className="card-case-study" href={link || ''}>
			{content}
		</a>
	);
};

export default CaseStudyCard;
