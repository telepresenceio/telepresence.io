import React from 'react';
import './styles.less';

const SocialCard = ({ logo, title, link, description }) => {
	return (
		<a className="card-social-network" href={link || ''}>
			{logo && <img src={logo} alt={`${title} logo`} width="48" height="48" />}
			<div className="card-social-network-content">
				<h4 className="card-social-network-content-title">{title}</h4>
				<p>{description}</p>
			</div>
		</a>
	);
};

export default SocialCard;
