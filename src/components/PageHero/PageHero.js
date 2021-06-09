import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.less';
import sectionColors from '../colors.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import RichText from '../RichText/RichText';
import { MultipleCTAs } from '../CTAs/CTAs';
import { SanityFluidImage } from '../SanityImage/SanityImage';

export default ({ title, body, ctas, bgImage, bgColor = '#fff' }) => {
  const overwriteColorStyles = {
    color: bgImage?.palette ? bgImage.palette.foreground : undefined,
  };

  const colorMapping =
    SECTION_COLOR_MAPPINGS[bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  return (
    <section
      className={classnames(styles.Hero, sectionColors[colorMapping.label])}
    >
      <div className={styles.Container}>
        <div className={styles.Content} style={overwriteColorStyles}>
          <h1 style={overwriteColorStyles}>{title}</h1>
          {body && (
            <RichText
              className={styles.body}
              renderContainerOnSingleChild={true}
              blocks={body}
            />
          )}
          <MultipleCTAs ctas={ctas} colorMapping={colorMapping} />
        </div>
      </div>
      {bgImage && (
        <SanityFluidImage
          {...bgImage}
          className={styles.bgImage}
          backgroundColor={bgImage.palette?.background}
          fluidOptions={{ maxWidth: 2000 }}
          alt=""
          style={{
            '--afterBg':
              bgImage.palette?.foreground === '#fff'
                ? 'rgba(0,0,0,.5)'
                : 'rgba(176, 197, 209, .4)',
            '--afterBlendMode':
              bgImage.palette?.foreground === '#fff' ? 'darken' : 'lighten',
          }}
        />
      )}
    </section>
  );
};
