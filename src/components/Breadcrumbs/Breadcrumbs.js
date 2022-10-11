import React from 'react';
import Polygon from '../../assets/images/polygon.svg';

import './style.less';

const Breadcrumbs = ({ preview, current }) => {
	if (!preview || !current) {
		return null;
	}

	return (
		<div className="breadcrumbsContainer">
			<div className="breadcrumbsContainer_content">
				<p>
					<span>
						<a href={preview.link}>{preview.label}</a>
					</span>
					<img src={Polygon} alt="right arrow" />
					{current && <span>{current}</span>}
				</p>
			</div>
			<div className="breadcrumbsContainer_line" />
		</div>
	);
};

export default Breadcrumbs;
