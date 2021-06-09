import React from 'react';
import classnames from 'classnames';

import RichText from '../RichText/RichText';

import pageBodyStyles from '../PageBody/styles.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import sectionColors from '../colors.module.less';

export default ({ body, bgColor }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  return (
    <RichText
      blocks={body}
      className={classnames(
        pageBodyStyles.richText,
        sectionColors[colorMapping.label],
        colorMapping !== SECTION_COLOR_MAPPINGS['#fff'] &&
          pageBodyStyles.richTextColored,
      )}
    />
  );
};
