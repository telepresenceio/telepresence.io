import React, { useMemo } from 'react';
import { PropTypes } from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';
import styles from './tag.module.less';

export const Tag = ({ color, iconClassname, iconName, text }) => {
  const colorStyle = useMemo(() => {
    switch (color) {
      case 'purple':
        return styles.purple;
      case 'red':
        return styles.red;
      case 'green':
        return styles.green;
      case 'blue':
      default:
        return styles.blue;
    }
  }, [color]);
  return (
    <div className={`${styles.tag} ${colorStyle}`}>
      <div className={styles.tag_content}>
        {iconName && (
          <Icon
            name={iconName}
            className={classnames(styles.tag_icon, iconClassname)}
          />
        )}
        <span className={styles.tag_text}>{text}</span>
      </div>
    </div>
  );
};

Tag.propTypes = {
  color: PropTypes.string,
  iconName: PropTypes.string,
  iconClassname: PropTypes.string,
  text: PropTypes.string.isRequired,
};
