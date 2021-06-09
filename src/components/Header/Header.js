import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
// components
import Link from '../Link';
// images
import ambassadorLogo from '../../images/ambassador-logo.svg';
import careerIcon from '../../../static/images/career-icon.svg'
// styles
import styles from './styles.module.less';

const DropdownLink = ({ label, links, url }) => {
  if (!links) {
    return <Link to={url}>{label}</Link>;
  }
  return (
    <div className={styles.dropdownSection}>
      {url ? <Link to={url}>{label}</Link> : <span>{label}</span>}
      <div className={styles.dropdownSectionLinks}>
        {links.map((l) => (
          <DropdownLink key={l.label} {...l} />
        ))}
      </div>
    </div>
  );
};

const NavLinkGroup = ({
  title,
  subtitle,
  link,
  icon,
  nowrap
}) => {
  return (
    <div
      className={classNames(
        styles.NavLinkGroup,
        subtitle ? styles.NavLinkGroupSub : ''
      )}
    >
      <div className={styles.NavLinkIcon}>
        {icon && <img src={icon.asset.url} alt={title} loading="lazy" width={icon.asset.metadata.dimensions.width} height={icon.asset.metadata.dimensions.height} />}
      </div>
      <div className={nowrap ? styles.NavTextWrap : ''}>
        {title &&
          <Link to={link}>
            <Fragment>
              {title}
              {subtitle && <p className={styles.NavLinkSubtitle}>{subtitle}</p>}
            </Fragment>
          </Link>
        }
      </div>
    </div>
  )
}

const Dropdown = ({
  title,
  primary,
  secondary,
  primaryTitle,
  primaryLink,
  primaryIcon
}) => {
  return (
    <div
      className={
        classNames(
          styles.Dropdown,
          title === 'Products' || title === 'Use Cases' || title === 'Developer Control Plane' ? styles.MobilePrimary : styles.MobileSecondary
        )
      }
    >
      <button className={styles.DropdownButton}>
        <span>
          {title}
        </span>
      </button>
      <div className={styles.DropdownGroup}>
        {primary.length > 0 &&
          <Fragment>
            {primaryTitle &&
              <div className={styles.NavPrimaryLink}>
                {primaryIcon && <img src={primaryIcon.asset.url} alt={title} loading="lazy" height={primaryIcon.asset.metadata.height} width={primaryIcon.asset.metadata.width} />}
                <Link to={primaryLink}>{primaryTitle}</Link>
              </div>
            }
            <div
              className={
                classNames(
                  styles.NavPrimary,
                  title === 'Products' ? styles.NavPrimaryMobile : '',
                  title === 'Developers' ? styles.NavHidden : '',
                )
              }
            >
              {primary.map((data) => {
                return (
                  <div
                    key={data._key}
                    className={
                      classNames(
                        styles.NavGroup,
                        title === 'Products' ? styles.NavGroupMain : '',
                        title === 'Developers' ? styles.NavDevPrimary : '',
                        title === 'Company' ? styles.NavGroupAbout : ''
                      )
                    }
                  >
                    {data.title &&
                      <p
                        className={
                          classNames(
                            title === 'Developers' ? styles.NavGroupTitle : styles.NavGroupTitleLarge,
                            data.title === 'USE CASES' || data.title === "DEVELOPER CONTROL PLANE" ? styles.MobileGroupTitle : ''
                          )
                        }
                      >
                        {data.title}
                      </p>
                    }
                    {data.navLinkGroup.map((group) => (
                      <NavLinkGroup
                        key={group.title}
                        icon={group.icon}
                        title={group.title}
                        subtitle={group.subtitle}
                        link={group.link}
                        nowrap={data.title === 'BUILT ON OPEN-SOURCE'}
                      />
                    ))}
                  </div>
                )
              })
              }
            </div>
          </Fragment>
        }
        {secondary.length > 0 &&
          <div
            className={
              classNames(
                styles.NavSecondary,
                title === 'Developers' ? styles.NavSecondaryMobile : ''
              )
            }
          >
            {secondary.map((data) => {
              return (
                <div
                  key={data._key}
                  className={
                    classNames(
                      styles.NavGroup,
                      title === 'Developers' ? styles.NavDevSecondary : ''
                    )
                  }
                >
                  {data.title &&
                    <p className={styles.NavGroupTitle}>{data.title}</p>
                  }
                  {data.navLinkGroup.map((group) => (
                    <NavLinkGroup
                      developers={title === 'Developers'}
                      key={group.title}
                      icon={group.icon}
                      title={group.title}
                      subtitle={group.subtitle}
                      link={group.link}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        }
      </div>
    </div>
  )
};

const DropdownCTA = ({ ctaLink }) => {
  return (
    <div className={styles.Dropdown}>
      <button className={styles.DropdownButton}>{ctaLink.label}</button>
      <div className={styles.DropdownContent}>
        {ctaLink.links.map((link) => (
          <DropdownLink
            key={link.label}
            label={link.label}
            links={link.links}
            url={link.url}
          />
        ))}
      </div>
    </div>
  )
}

const NavLink = ({ label, url }) => {
  if (label === 'Pricing') {
    return (
      <li className={styles.MobileNavSecond}>
        <img src={careerIcon} alt='' loading="lazy" />
        <Link
          activeClassName={styles.NavLinkActive}
          className={styles.NavLink}
          to={url}
        >
          <span>
            {label}
          </span>
        </Link>
      </li>
    )
  } else {
    return (
      <li>
        <Link
          activeClassName={styles.NavLinkActive}
          className={styles.NavLink}
          to={url}
        >
          {label}
        </Link>
      </li>
    )
  }
};

const Header = ({ hasAnnouncement }) => {
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('https://app.getambassador.io/cloud/api/userinfo', { credentials: 'include', redirect: 'follow' }).then((r) => r.json().then(res => {
      setUserInfo(res);
      setIsLoading(false);
    })).catch(err => {
      setIsLoading(false);
    });
  }, [])

  const { sanitySiteNav } = useStaticQuery(graphql`
    query {
      sanitySiteNav {
        headerLinksMain {
          _key
          title
          link
          primaryTitle
          primaryLink
          primaryIcon {
            asset {
              url
              metadata {
                dimensions {
                  height
                  width
                }
              }
            }
          }
          navPrimary {
            _key
            title
            navLinkGroup {
              icon {
                asset {
                  url
                  metadata {
                    dimensions {
                      height
                      width
                   }
                  }
                }
              }
              title
              subtitle
              link
            }
          }
          navSecondary {
            _key
            title
            navLinkGroup {
              icon {
                asset {
                  url
                  metadata {
                    dimensions {
                      height
                      width
                   }
                  }
                }
              }
              title
              subtitle
              link
            }
          }
        }
        headerLinksRight {
          label
          ctaLink
          links {
            label
            url
          }
        }
      }
    }
  `);

  const toggleNav = () => {
    setOpen(!open);
  };

  const {
    headerLinksMain,
    headerLinksRight
  } = sanitySiteNav

  return (
    <header
      className={classNames(styles.Header, hasAnnouncement && styles.buffer)}
    >
      <div className={styles.Container}>
        <div className={styles.MobileTop}>
          <Link
            to="/"
            className={styles.LogoLink}
          >
            <img
              src={ambassadorLogo}
              alt="Ambassador Logo"
            />
          </Link>
          <button
            onClick={toggleNav}
            className={classNames(styles.Burger, open && styles.open)}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav className={classNames(styles.MobileNav, open && styles.open)}>
          <ul className={styles.NavContainer}>
            {headerLinksMain.map((links) => {
              if (links.navPrimary.length > 0) {
                return (
                  <li
                    key={links.title}
                    className={
                      classNames(
                        links.title === 'Developers' ? styles.MobileNavFirst : '',
                        links.title === 'Company' ? styles.MobileNavThird : ''
                      )
                    }
                  >
                    <Dropdown
                      key={links.key}
                      title={links.title}
                      primaryTitle={links.primaryTitle}
                      primaryLink={links.primaryLink}
                      primaryIcon={links.primaryIcon}
                      primary={links.navPrimary}
                      secondary={links.navSecondary}
                    />
                  </li>
                );
              }
              if (links.link) {
                return (
                  <NavLink
                    key={links.title}
                    label={links.title}
                    to={links.link}
                    url={links.link}
                  />
                )
              }
              return null;
            })}
          </ul>
          <div className={classNames(styles.RightNavContainer, { [styles.RightNavMinWidth]: userInfo })}>
            {!isLoading && (
              userInfo ?
                <Link to="https://app.getambassador.io/" className={styles.UserAccount}>
                  <img src={userInfo.avatarUrl} alt={userInfo.accountName} className={styles.UserAvatar} />
                  <span>
                    {userInfo.accountName}
                  </span>
                </Link>
                :
                headerLinksRight.ctaLink ?
                  (
                    <Link
                      className={styles.RightNav}
                      to={headerLinksRight.ctaLink}
                    >
                      {headerLinksRight.label}
                    </Link>
                  )
                  :
                  (
                    <DropdownCTA
                      ctaLink={headerLinksRight}
                    />
                  )
            )
            }
          </div>
        </nav>
      </div>
    </header >
  );
};

export default Header;
