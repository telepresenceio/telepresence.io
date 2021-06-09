import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';
import pageBodyStyles from '../PageBody/styles.module.less';
import RichText from '../RichText/RichText';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import sectionColors from '../colors.module.less';
import { SingleCTA } from '../CTAs/CTAs';

export default ({ body, cta, ...visuals }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[visuals.bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  return (
    <aside
      className={classnames(
        styles.wrapper,
        pageBodyStyles.contained,
        pageBodyStyles['contained_lg'],
      )}
    >
      <div
        className={classnames(
          styles.container,
          sectionColors[colorMapping.label],
        )}
      >
        {body && <RichText blocks={body} />}
        {cta && (
          <p>
            <SingleCTA {...cta} colorMapping={colorMapping} />
          </p>
        )}
      </div>
    </aside>
  );
};
