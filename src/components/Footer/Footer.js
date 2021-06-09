import React from 'react';
import classnames from 'classnames';
import { useStaticQuery, graphql } from 'gatsby';
// components
import FooterLinks from './FooterLinks';
import HubspotForm from '../../components/HubspotForm';
import Link from '../../components/Link';
// utils
import isDocLink from '../../utils/isDocLink';
// images
import {
  GithubLogo,
  MediumLogo,
  SlackLogo,
  TwitterLogo,
} from '../icons/socialIcons';
// styles
import '@fontsource/inter';
import "@fontsource/inter/200.css"
import "@fontsource/inter/600.css"
import styles from './styles.module.less';

const Footer = ({ location }) => {
  const { sanitySocialProfiles, sanitySiteNav } = useStaticQuery(
    graphql`
      query {
        sanitySocialProfiles {
          githubLink
          twitterLink
          slackLink
          mediumLink
        }
        sanitySiteNav {
          footerLinks {
            label
            links {
              ... on SanityFooterLink {
                label
                url
              }
              ... on SanityFooterSubSection {
                label
                url
                links {
                  label
                  url
                }
              }
            }
          }
        }
      }
    `
  )

  return (
    <footer
      className={classnames(
        styles.Footer,
        isDocLink((location || {}).pathname) && styles.hidden,
      )}
    >
      <div className={styles.footerContent}>
        <div className={styles.socialSection}>
          <span>Keep up with the latest</span>
          <HubspotForm />
          <div className={styles.socialLinks}>
            <Link to={sanitySocialProfiles.twitterLink} title="Our Twitter profile">
              <TwitterLogo />
            </Link>
            <Link to={sanitySocialProfiles.githubLink} title="Our GitHub repository">
              <GithubLogo />
            </Link>
            <Link to={sanitySocialProfiles.slackLink} title="Join our Slack">
              <SlackLogo />
            </Link>
            <Link to={sanitySocialProfiles.mediumLink} title="Our Medium blog">
              <MediumLogo />
            </Link>
          </div>
        </div>
        <FooterLinks links={sanitySiteNav.footerLinks} />
        <div className={styles.logoWrapper}>
          <Link to="/">
            &copy; Ambassador
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
