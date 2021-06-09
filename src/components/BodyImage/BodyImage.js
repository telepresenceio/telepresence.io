import React from 'react';

import { SanityFluidImage } from '../SanityImage/SanityImage';

// For most instances of bodyImage, we're extracting the asset id from the asset object to save some bandwidth of unused data
// In some instances, however, this might not be present, so we fallback to the regular asset
export default ({ assetId, alt, caption, asset, crop, hotspot }) => {
  if (!assetId && !asset) {
    return null;
  }
  return (
    <div
      style={{
        maxWidth: '800px',
        textAlign: 'center',
        margin: '2em auto',
      }}
    >
      <SanityFluidImage
        assetId={assetId || asset?._id}
        fluidOptions={{ maxWidth: 850 }}
        alt={alt || caption}
        crop={crop}
        hotspot={hotspot}
      />
      {caption && <p style={{ fontStyle: 'italic' }}>{caption}</p>}
    </div>
  );
};
