import React from 'react';
import classnames from 'classnames';

import RichText from '../RichText/RichText';
import { getOriginalImgUrl, getFixedProps } from '../../utils/sanity';

import styles from './styles.module.less';
import sectionColors from '../colors.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import MediaItem from './MediaItem';
import { MultipleCTAs } from '../CTAs/CTAs';

const IMG_SIZES = {
  sm: 40,
  md: 150,
  lg: 320,
};

// itemSize can also include sideImg, which is a different Item Style.
// This prop is still named itemSize instead of itemStyle to avoid having to run a migration operation
export default ({ title, body, items = [], ctas, ...visuals }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[visuals.bgColor] || SECTION_COLOR_MAPPINGS['#fff'];

  const isSideImg = visuals.itemSize === 'sideImg';
  // When itemSize === 'sideImg', we don't care about itemImageSize as we're always going to have images at 70px wide
  const imageWidth = isSideImg ? 70 : IMG_SIZES[visuals.itemImageSize || 'md'];
  const itemWidth = visuals.itemSize || 'md';
  // Add a `fixed` object to the item's image for rendering inside of MediaItem
  const itemsWithFixed = React.useMemo(
    () =>
      items.map((i) => {
        if (i.image && i.image.assetId) {
          const imageExt = i.image.assetId.split('-')[3];
          let fixed = getFixedProps(i.image, { width: imageWidth });
          // If we use Gatsby Image for SVGs, they'll be rasterized, which we don't want, so we get its original URL instead
          if (imageExt === 'svg') {
            return {
              ...i,
              svgUrl: getOriginalImgUrl(i.image.assetId),
              // However, we still want to know its height for the given width
              imgHeight: fixed.height,
            };
          }
          return { ...i, fixed, imgHeight: fixed.height };
        }
        return i;
      }),
    [items, imageWidth],
  );
  // And use these fixed objects to find the highest aspect ratio of all images, which corresponds to the highest image, given we have a fixed width
  const highestHeight = React.useMemo(
    () =>
      // If sideImg, we don't want to define a height for all images to follow
      !isSideImg &&
      itemsWithFixed.map((i) => i.imgHeight).sort((a, b) => b - a)[0],
    [itemsWithFixed, isSideImg],
  );
  // Getting the highest img height will enable us to align all items content and prevent a weird layout.
  // In the future this complex logic could be moved into a simple display: subgrid property in CSS, when that becomes a reality in major browsers
  const maxImgHeight = highestHeight ? highestHeight + 'px' : 'auto';

  // sideImg can't be aligned to center
  const alignCenter = visuals.alignCenter && visuals.itemSize !== 'sideImg';
  return (
    <section
      className={classnames(styles.wrapper, sectionColors[colorMapping.label])}
    >
      <div className={styles.container}>
        {title && <h2>{title}</h2>}
        {body && (
          <RichText
            renderContainerOnSingleChild={true}
            className={classnames(
              styles.body,
              body.length > 1 && styles.bodySm,
            )}
            blocks={body}
          />
        )}
        <div
          className={classnames(styles.items, styles[`itemSize_${itemWidth}`])}
        >
          {itemsWithFixed.map((i) => (
            <MediaItem
              key={i.title}
              {...i}
              imageWidth={imageWidth}
              maxImgHeight={maxImgHeight}
              alignCenter={alignCenter}
              buttonColor={
                i.cta && i.cta.btnColor && i.cta.btnColor !== 'auto'
                  ? i.cta.btnColor
                  : colorMapping.button
              }
            />
          ))}
        </div>
        <MultipleCTAs ctas={ctas} colorMapping={colorMapping} />
      </div>
    </section>
  );
};
