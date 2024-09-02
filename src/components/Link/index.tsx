import * as React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { Link as ScrollLink } from 'react-scroll';

const Link = ({ children, ...props}) => {
  let to = props.to || props.href;
  if (!to) {
    // not a link
    return <a {...props}>{children}</a>;
  } else if (to.indexOf('http://') === 0 || to.indexOf('https://') === 0 || props.target === "_blank") {
    // external link
    props.target = "_blank";
    props.rel = "nofollow noopener noreferrer";
    delete props.to;
    props.href = to;
    return <a {...props}>{children}</a>;
  } else if (to.startsWith('#')) {
    // internal link to a fragment within this page
    props.to = to.slice(1);
    delete props.href;
    return <ScrollLink smooth={true} {...props}>{children}</ScrollLink>
  } else {
    // internal link to a different page
    return <GatsbyLink to={to}>{children}</GatsbyLink>
  }
};

export default Link;
