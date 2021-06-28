import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { Link as ScrollLink } from 'react-scroll';
import url from 'url';

const Link = ({ children, ...props}) => {
  const to = props.to || props.href;
  if (!to) {
    // not a link
    return <a {...props}>{children}</a>;
  } else if (url.parse(to).protocol || props.target === "_blank") {
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
    props.to = to;
    delete props.href;
    return <GatsbyLink {...props}>{children}</GatsbyLink>
  }
};

export default Link;
