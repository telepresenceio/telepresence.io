import React from 'react';
import '../Layout/layout.less';

const LINKS = [
	{ label: 'Quick Start', link: '/docs/latest/quick-start/' },
<<<<<<< HEAD
	{ label: 'Docs', link: 'https://www.getambassador.io/docs/telepresence/' },
=======
	{ label: 'Docs', link: '/docs/latest/' },
>>>>>>> 335547e (rebase)
	{ label: 'Case Studies', link: '/case-studies' },
	{ label: 'Community', link: '/community' },
	{ label: 'About', link: '/about' },
	{
<<<<<<< HEAD
		label: 'GitHub',
=======
		label: 'Github',
>>>>>>> 335547e (rebase)
		link: 'https://github.com/telepresenceio/telepresence',
		isExternal: true,
	},
];

const MainNav = () => {
	return (
		<ul>
			{LINKS.map((item, index) => {
				const linkProps = {
					href: item.link,
				};

				if (item.isExternal) {
					linkProps.target = '_blank';
					linkProps.rel = 'noreferrer';
				}

				return (
					<li key={index}>
						<a {...linkProps}>{item.label}</a>
					</li>
				);
			})}
		</ul>
	);
};

<<<<<<< HEAD
export default MainNav;
=======
export default MainNav;
>>>>>>> 335547e (rebase)
