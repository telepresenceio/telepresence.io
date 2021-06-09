import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';
import RichText from '../RichText/RichText';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import sectionColors from '../colors.module.less';
import { MultipleCTAs } from '../CTAs/CTAs';

export default ({ title, body, ctas, ...visuals }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[visuals.bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  const isOnlyBtn = !title && (!body || body.length === 0);
  return (
    <section
      className={classnames(
        styles.wrapper,
        sectionColors[colorMapping.label],
        isOnlyBtn ? styles.isOnlyBtn : '',
      )}
    >
      <div
        className={classnames(
          styles.container,
          visuals.alignCenter ? styles.alignCenter : '',
        )}
      >
        {title && <h2>{title}</h2>}
        {body && <RichText blocks={body} />}
        <MultipleCTAs ctas={ctas} colorMapping={colorMapping} />
      </div>
    </section>
  );
};
