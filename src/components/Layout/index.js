import React from 'react';
import { Helmet } from 'react-helmet';

import Platform from '@src/components/Platform';

import './globalHelpers.less';
import './layout.less';
import './docs-layout.less';
import './home.css';

import ImgLogo from '../../assets/images/telepresence-logo.png';

export default function Layout({ location, children }) {
	return (
		<Platform.Provider>
			<Helmet>
				<meta
					name="keywords"
					content="Telepresence, Kubernetes, microservices"
				/>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Helmet>

			<header className="white-bg">
				<div className="navigation-left">
					<a className="datawire-link" href="/">
						<img alt="Telepresence" src={ImgLogo} />
					</a>
					<ul className="main-navigation">
						<li>
							<a href="/docs/latest/">Docs</a>
						</li>
						<li>
							<a href="/case-studies">Case Studies</a>
						</li>
						<li>
							<a href="/community">Community</a>
						</li>
						<li>
							<a href="/about">About</a>
						</li>
						<li>
							<a
								target="_blank"
								rel="noreferrer"
								href="https://github.com/telepresenceio/telepresence"
							>
								GitHub
							</a>
						</li>
					</ul>
				</div>
				<div className="navigation-right">
					<ul className="main-navigation right">
						<li>
							<div className="dropdown">
								<button className="dropbtn">▾ Need Help?</button>
								<div className="dropdown-content">
									<a
										target="_blank"
										rel="noreferrer"
										href="https://a8r.io/slack"
									>
										Community Slack
									</a>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</header>

			<div className="main-body">{children}</div>

			<footer className="white-bg">
				<ul className="main-navigation flex-center">
					<li>
						<a href="/docs/latest">Docs</a>
					</li>
					<li>
						<a href="/case-studies">Case Studies</a>
					</li>
					<li>
						<a href="/about">About</a>
					</li>
					<li>
						<a
							target="_blank"
							rel="noreferrer"
							href="https://github.com/telepresenceio/telepresence"
						>
							GitHub
						</a>
					</li>
					<li>
						<a target="_blank" rel="noreferrer" href="https://a8r.io/slack">
							Slack
						</a>
					</li>
				</ul>
			</footer>
		</Platform.Provider>
	);
}
