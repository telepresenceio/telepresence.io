import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { Link as AnchorLink } from 'react-scroll';

const Link = ({ children, to, ...other }) => {
  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = (() => {
    // if it parses as an absolute URL, mark it as external
    if (!to) {
      return false;
    }
    try {
      new URL(to); // will throw an exception if 'to' is not absolute
      return false;
    } catch {
      // or else mark it as internal
      return true;
    }
  })();
  const anchor = /^#/.test(to);

  const isPDF = /.+\.pdf$/.test(to);

  // Use Gatsby Link for internal links, and <a> for others
  if (anchor) {
    return (
      <AnchorLink
        to={to.substring(1)}
        smooth={true}
        className={other.className}
        offset={other.customOffset || -72}
        href={to}
      >
        {children}
      </AnchorLink>
    );
  } else if (internal && !isPDF) {
    if (
      (to !== undefined && !to.startsWith('/')) ||
      other.target === '_blank'
    ) {
      // FFS https://github.com/gatsbyjs/gatsby/issues/6945
      return (
        // Default for internal links is _self target
        <a
          href={to}
          className={other.className}
          target={other.target || '_self'}
        >
          {' '}
          {children}{' '}
        </a>
      );
    }

    // force trailing slash on internal links
    let [, toPath, toRest] = to.match(/([^?#]*)(.*)/);
    if (!toPath.endsWith('/')) {
      toPath += '/';
      to = toPath + toRest;
    }

    return (
      <GatsbyLink to={to} {...other}>
        {children}
      </GatsbyLink>
    );
  }

  // Default for external links is opening in a new window
  const target = other.target || '_blank';
  return (
    <a
      {...other}
      href={to}
      target={target}
      rel={(target && 'noopener noreferrer') || ''}
      className={other.className}
    >
      {children}
    </a>
  );
};

export default Link;
