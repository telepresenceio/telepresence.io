import React from 'react';

import Link from '../../components/Link';

import styles from './styles.module.less';

const FooterLinks = ({ links = [] }) => (
  <div className={styles.menu}>
    {links.map((section, sectionIndex) => (
      <div className={styles.menuGroup} key={sectionIndex}>
        <span>{section.label}</span>
        <ul>
          {section.links.map((link, index) => {
            if (link.links?.length) {
              return (
                <li key={index}>
                  {link.url ? (
                    <Link to={link.url}>{link.label}</Link>
                  ) : (
                    <span>{link.label}</span>
                  )}
                  <ul>
                    {link.links.map((subLink, subIndex) => (
                      <li key={subIndex}>
                        <Link to={subLink.url}>{subLink.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return (
              <li key={index}>
                <Link to={link.url}>{link.label}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </div>
);

export default FooterLinks;
