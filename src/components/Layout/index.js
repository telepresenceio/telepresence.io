import React from 'react';
import { Helmet } from 'react-helmet';

export default function Layout({ children }) {
  return (
    <>
      <Helmet>
        <meta name="keywords" content="Telepresence, Kubernetes, microservices"/>
        <link rel="shortcut icon" href="/favicon.ico"/>
      </Helmet>

      <header class="white-bg">
        <div class="navigation-left">
          <a class="datawire-link" href="/">
            <img alt="Telepresence" src="/images/telepresence-logo.png"/>
          </a>
          <ul class="main-navigation">
            <li>
              <a href="/tutorials/docker">Get Started</a>
            </li>
            <li>
              <a href="/discussion/overview">Docs</a>
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
              <a target="_blank" rel="noreferrer" href="https://github.com/telepresenceio/telepresence">GitHub</a>
            </li>
          </ul>
        </div>
        <div class="navigation-right">
          <ul class="main-navigation right">
            <li>
              <div class="dropdown">
                <button class="dropbtn">▾ Need Help?</button>
                <div class="dropdown-content">
                  <a target="_blank" rel="noreferrer" href="https://a8r.io/slack">Community Slack</a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </header>

      <div className="main-body">{children}</div>

      <footer class="white-bg">
        <ul class="main-navigation flex-center">
          <li>
            <a href="/tutorials/kubernetes">Get Started</a>
          </li>
          <li>
            <a href="/discussion/overview">Docs</a>
          </li>
          <li>
            <a href="/case-studies">Case Studies</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a target="_blank" rel="noreferrer" href="https://github.com/telepresenceio/telepresence">GitHub</a>
          </li>
          <li>
            <a target="_blank" rel="noreferrer" href="https://a8r.io/slack">Slack</a>
          </li>
        </ul>
      </footer>
    </>
  );
};
