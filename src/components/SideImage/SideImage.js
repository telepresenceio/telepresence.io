import React from 'react';
import GatsbyImage from 'gatsby-image';
import classnames from 'classnames';

import RichText from '../RichText/RichText';

import styles from './styles.module.less';
import sectionColors from '../colors.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import { getFluidProps } from '../../utils/sanity';

export default ({ title, body, image, ctas, ...visuals }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[visuals.bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  const imageFluidProps =
    image &&
    image.assetId &&
    getFluidProps(image, {
      maxWidth: 650,
    });
  return (
    <section
      className={classnames(
        styles.wrapper,
        sectionColors[colorMapping.label],
        visuals.imagePosition === 'left' && styles.isLeft,
        // Default image size to lg
        styles[`size_${visuals.imageSize || 'lg'}`],
        visuals.textSize === 'sm' && styles.textSm,
      )}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          {title && <h2>{title}</h2>}
          {body && <RichText blocks={body} className={styles.body} />}
        </div>
        <div className={styles.image}>
          {imageFluidProps && (
            <GatsbyImage fluid={imageFluidProps} alt={image.alt} />
          )}
          {image && image.caption && (
            <p style={{ fontStyle: 'italic' }}>{image.caption}</p>
          )}
        </div>
      </div>
    </section>
  );
};
