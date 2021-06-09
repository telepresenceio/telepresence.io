import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import icons from './icons';

function Icon({ name, className }) {
  const Icon = useMemo(() => icons.get(name), [name]);
  return <Icon className={className} />;
}

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
};

Icon.defaultProps = {
  name: '',
  className: '',
};

export default Icon;
