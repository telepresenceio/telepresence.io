import { getFixedGatsbyImage, getFluidGatsbyImage } from 'gatsby-source-sanity';

export const sanityConfig = { projectId: 'e3vd3ukt', dataset: 'production' };

export const getOriginalImgUrl = (assetId) => {
  if (!assetId || typeof assetId !== 'string') {
    return;
  }
  const splitted = assetId.split('-');
  // from image-reallyLongId-WxH-ext
  // to reallyLongId-WxH.ext
  const imagePath = splitted[1] + '-' + splitted[2] + '.' + splitted[3];
  return `https://cdn.sanity.io/images/${sanityConfig.projectId}/${sanityConfig.dataset}/${imagePath}`;
};

function getSrcsWithCrop({ assetId, srcs, crop }) {
  let newSrcs = { ...srcs };
  const [, , dimensions] = assetId.split('-');
  // Get the original width and height
  const [width, height] = dimensions.split('x');

  // Let's calculate the rect query string to crop the image
  const { left, top, right, bottom } = crop;
  const effectiveWidth = Math.ceil((1 - left - right) * width);
  const effectiveHeight = Math.ceil((1 - top - bottom) * height);

  // rect=x,y,width,height
  // (each is in absolute PX, that's why we refer to width and height)
  const cropQueryStr = `&rect=${Math.floor(left * width)},${Math.floor(
    top * height,
  )},${effectiveWidth},${effectiveHeight}`;

  /*
    cdn.sanity.io/...?w=100&h=94&fit=crop 1x,
    cdn.sanity.io/...?w=150&h=94&fit=crop 1.5x,
    */
  function addToSrcset(srcSet) {
    return (
      srcSet
        .split(',')
        // Map over each individual declaration (divided by ,)
        .map((declaration) => {
          // And get their URLs for further modification
          const [url, multiplier] = declaration.split(' ');
          return `${url}${cropQueryStr} ${multiplier}`;
        })
        // and finally turn this back into a string
        .join(',')
    );
  }

  // Add the rect query string we created to all src declarations
  newSrcs.src = srcs.src + cropQueryStr;
  newSrcs.srcWebp = srcs.srcWebp + cropQueryStr;
  newSrcs.srcSet = addToSrcset(srcs.srcSet);
  newSrcs.srcSetWebp = addToSrcset(srcs.srcSetWebp);

  return newSrcs;
}

export const getFixedProps = ({ assetId, crop }, options) => {
  let fixed = getFixedGatsbyImage(assetId, options, sanityConfig);
  // If we have a crop, let's add it to every URL in the fixed object
  if (crop && crop.top) {
    return getSrcsWithCrop({ assetId, srcs: fixed, crop });
  }
  return fixed;
};

export const getFluidProps = ({ assetId, crop }, options) => {
  let fluid = getFluidGatsbyImage(assetId, options, sanityConfig);
  // If we have a crop, let's add it to every URL in the fluid object
  if (crop && crop.top) {
    return getSrcsWithCrop({ assetId, srcs: fluid, crop });
  }
  return fluid;
};
