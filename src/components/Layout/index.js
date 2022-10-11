<<<<<<< HEAD


=======
>>>>>>> 335547e (rebase)
import React, { useState } from 'react';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';

import Platform from '@src/components/Platform';
import MainNav from '@src/components/MainNav';

import './globalHelpers.less';
import './layout.less';
import './docs-layout.less';
import './home.css';

<<<<<<< HEAD
<<<<<<< HEAD
import TelepresenceLogo from '../../assets/images/telepresence-edgy.svg';

export default function Layout({ location, children }) {
	const [open, setOpen] = useState(false);

	const toggleNav = () => setOpen(!open);

	return (
		<Platform.Provider>
			<Helmet>
				<meta
					name="keywords"
					content="Telepresence, Kubernetes, microservices"
				/>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Helmet>

			<header className="header">
				<div className="headerContainer">
					<div className="MobileTop">
						<a href="/" className="LogoLink">
							<img
								src={TelepresenceLogo}
								alt="Telepresence Logo"
								width="32"
								height="32"
							/>
							<p>Telepresence</p>
						</a>
						<button
							onClick={toggleNav}
							className={classnames('Burger', { open: open })}
							aria-label="Open and close menu"
						>
							<span />
							<span />
							<span />
							<span />
						</button>
					</div>
					<nav className="desktopNav">
						<MainNav />
						<a
							className={classnames('btn-purple-light')}
							target="_blank"
							rel="noreferrer"
							href="https://a8r.io/slack"
						>
							need help?
						</a>
					</nav>
				</div>
				{open && (
					<nav className="nav">
						<MainNav />
						<a
							className={classnames('btn-purple-light', 'needHelpButton')}
							target="_blank"
							rel="noreferrer"
							href="https://a8r.io/slack"
						>
							need help?
						</a>
					</nav>
				)}
			</header>

			<div className="main-body">{children}</div>
		</Platform.Provider>
	);
}
=======
import ImgLogo from '../../assets/images/telepresence-logo.png';
=======
import TelepresenceLogo from '../../assets/images/telepresence-edgy.svg';
>>>>>>> 335547e (rebase)

export default function Layout({ location, children }) {
	const [open, setOpen] = useState(false);

	const toggleNav = () => setOpen(!open);

	return (
		<Platform.Provider>
			<Helmet>
				<meta
					name="keywords"
					content="Telepresence, Kubernetes, microservices"
				/>
				<link rel="shortcut icon" href="/favicon.ico" />
			</Helmet>

<<<<<<< HEAD
<<<<<<< HEAD
      <header className="white-bg">
        <div className="navigation-left">
          <a className="datawire-link" href="/">
            <img alt="Telepresence" src={ImgLogo}/>
          </a>
          <ul className="main-navigation">
            <li>
              <a href="https://www.getambassador.io/docs/telepresence/">Docs</a>
            </li>
            <li>
              <Link to="/docs/latest/quick-start/">Quick start</Link>
            </li>
            <li>
              <Link to="/case-studies">Case Studies</Link>
            </li>
            <li>
              <Link to="/community">Community</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <a target="_blank" rel="noreferrer" href="https://github.com/telepresenceio/telepresence">GitHub</a>
            </li>
          </ul>
        </div>
        <div className="navigation-right">
          <ul className="main-navigation right">
            <li>
              <div className="dropdown">
                <button className="dropbtn">▾ Need Help?</button>
                <div className="dropdown-content">
                  <a target="_blank" rel="noreferrer" href="https://a8r.io/slack">Community Slack</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </header>
=======
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
=======
			<header className="header">
				<div className="headerContainer">
					<div className="MobileTop">
						<a href="/" className="LogoLink">
							<img
								src={TelepresenceLogo}
								alt="Telepresence Logo"
								width="32"
								height="32"
							/>
							<p>Telepresence</p>
						</a>
						<button
							onClick={toggleNav}
							className={classnames('Burger', { open: open })}
							aria-label="Open and close menu"
						>
							<span />
							<span />
							<span />
							<span />
						</button>
					</div>
					<nav className="desktopNav">
						<MainNav />
						<a
							className={classnames('btn-purple-light')}
							target="_blank"
							rel="noreferrer"
							href="https://a8r.io/slack"
						>
							need help?
						</a>
					</nav>
>>>>>>> d31e862 (Add new main menu design)
				</div>
				{open && (
					<nav className="nav">
						<MainNav />
						<a
							className={classnames('btn-purple-light', 'needHelpButton')}
							target="_blank"
							rel="noreferrer"
							href="https://a8r.io/slack"
						>
							need help?
						</a>
					</nav>
				)}
			</header>
>>>>>>> 6651e0a (Remove banner)

			<div className="main-body">{children}</div>

<<<<<<< HEAD
      <div className="main-body">{children}</div>

      <footer className="white-bg">
        <ul className="main-navigation flex-center">
          <li>
            <a href="https://www.getambassador.io/docs/telepresence/">Docs</a>
          </li>
          <li>
            <Link to="/case-studies">Case Studies</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <a target="_blank" rel="noreferrer" href="https://github.com/telepresenceio/telepresence">GitHub</a>
          </li>
          <li>
            <a target="_blank" rel="noreferrer" href="https://a8r.io/slack">Slack</a>
          </li>
        </ul>
      </footer>
    </Platform.Provider>
  );
};
=======
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
>>>>>>> 6651e0a (Remove banner)
>>>>>>> 83dbe4c (rebase)
