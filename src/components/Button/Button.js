import React from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';

import Link from '../Link';

import styles from './styles.module.less';

const COLOR_CLASS_MAPPINGS = {
  red: styles.Red,
  white: styles.White,
  orange: styles.Orange,
  purple: styles.Purple,
  blue: styles.Blue,
  'red-outline': styles.RedOutline,
  'blue-outline': styles.BlueOutline,
  'orange-outline': styles.OrangeOutline,
  'purple-outline': styles.PurpleOutline,
  green: styles.Green,
};

const Button = ({
  to,
  color,
  className,
  children,
  newWindow,
  size,
  ...rest
}) => {
  let buttonColorClass = COLOR_CLASS_MAPPINGS[color] || null;
  const target = (newWindow && '_blank') || undefined;
  return (
    <Link
      to={to}
      className={classnames(
        styles.Button,
        buttonColorClass,
        className,
        size === 'sm' ? styles.ButtonSm : '',
      )}
      target={target}
      {...rest}
    >
      {children}
    </Link>
  );
};

Button.propTypes = {
color: PropTypes.oneOf(['red', 'white', 'orange', 'purple', 'blue', 'blue-outline', 'red-outline', 'orange-outline', 'purple-outline', 'green']),
  to: PropTypes.string,
};

export default Button;
