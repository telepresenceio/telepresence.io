import React from 'react';
import classnames from 'classnames';

import RichText from '../RichText/RichText';

import pageBodyStyles from '../PageBody/styles.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import sectionColors from '../colors.module.less';
import styles from './styles.module.less';

export default ({ leftBody, rightBody, bgColor, size = 'lg' }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  return (
    <div
      className={classnames(
        sectionColors[colorMapping.label],
        styles[`size_${size}`],
      )}
    >
      <div
        className={classnames(
          styles.container,
          colorMapping !== SECTION_COLOR_MAPPINGS['#fff'] &&
            styles.containerColored,
        )}
      >
        <RichText className={pageBodyStyles.richText} blocks={leftBody} />
        <RichText className={pageBodyStyles.richText} blocks={rightBody} />
      </div>
    </div>
  );
};
