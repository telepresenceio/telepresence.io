import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ children, location }) => {
  return (
    <div>
      <div className="main-body">{children}</div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
