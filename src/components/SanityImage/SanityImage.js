import React from 'react';
import GatsbyImage from 'gatsby-image';

import { getFluidProps, sanityConfig } from '../../utils/sanity';

/*
image: {
  _type: "image",
  asset: {
    _ref?: string,
    _id?: string,
    _type: "reference",
  }
}
*/
export const getSanityImageUrl = (image) => {
  if (!image || !image.asset) {
    return;
  }
  const _id = image.asset._ref || image.asset._id || '';
  const [, id, dimensions, extension] = _id.split('-');
  return `https://cdn.sanity.io/images/${sanityConfig.projectId}/${sanityConfig.dataset}/${id}-${dimensions}.${extension}`;
};

/*
Unfortunately, assetId is not truly the assetId, at moments it'll be an object containing `asset`, which in turn has a _ref or _id.
@TODO: When restructuring the Sanity data code, review the usage of assetId
*/
export const SanityFluidImage = ({
  assetId,
  fluidOptions,
  hotspot,
  crop,
  className,
  alt,
  style,
  imgStyle = {},
}) => {
  if (!assetId || !fluidOptions) {
    return null;
  }

  if (assetId.asset && assetId.asset._id) {
    const [, id, dimensions, extension] = assetId.asset._id.split('-');
    // If an SVG, we can serve the base SVG instead of a srcset with multiple sizes as that will rasterize the image, increase its payload and decrease its size
    if (extension === 'svg') {
      const [width, height] = dimensions.split('x');
      const src = `https://cdn.sanity.io/images/${sanityConfig.projectId}/${sanityConfig.dataset}/${id}-${dimensions}.svg`;
      return (
        <GatsbyImage
          fluid={{ aspectRatio: width / height, src, srcset: src }}
          alt={alt}
        />
      );
    }
  }

  const imgFluidProps = getFluidProps({ assetId, crop }, fluidOptions);

  return (
    <GatsbyImage
      alt={alt}
      fluid={imgFluidProps}
      className={className}
      style={style}
      imgStyle={{
        objectPosition: hotspot && `${hotspot.x * 100}% ${hotspot.y * 100}%`,
        ...imgStyle,
      }}
    />
  );
};
