import React from 'react';

import Link from '../../../components/Link';
import { isAbsUrl, getPathFromSlug } from '../../../utils/urls';
import { SanityFluidImage } from '../../SanityImage/SanityImage';

import ambassadorLogo from '../../../images/ambassador-logo.svg'

import styles from './styles.module.less';

// Giving the browser information about the size of resource images relative to the viewport's width
// Here is the data that generated these sizes:
/*
1000px+ -> from 248px to 298px -> standardize on 298
569 up to 999px -> ranging from 248px to 382.5px -> standardize on 360
568- -> 100vw with maximum of 398px -> split between 100vw and 398px
*/
const RES_IMAGE_SIZES = `
  (min-width: 1000px) 298px,
  (min-width: 569px) and (max-width: 999px) 360px,
  (min-width: 450px) and (max-width: 568px) 398px,
  100vw
`.trim();

const ResourceLink = ({
  date,
  hideType = false,
  image,
  isH2,
  title,
  type,
  url,
}) => {
  // One last check to make sure the path is well formatted
  // With the variety of resources we have, we want to prevent a spooky misformed relative address
  const finalUrl = isAbsUrl(url) ? url : getPathFromSlug(url);
  return (
    <article>
      <Link className={styles.Resource} to={finalUrl}>
        <div className={styles.About}>
          <div className={styles.Type}>
            {!hideType && type && type.title && (
              <>
                {type.svg && (
                  <div
                    className={styles.IconWrapper}
                    aria-hidden={true}
                    dangerouslySetInnerHTML={{ __html: type.svg }}
                  ></div>
                )}
                <span>{type.title}</span>
              </>
            )}
            {date && <div className={styles.Date}>{date}</div>}
          </div>
          <div
            className={`${styles.Title} ${title.length > 120 ? styles.TitleSm : ''
              }`}
          >
            {/* If parent section already has an h2, we want to render an h3 */}
            {/* Styles keep the same regardless of markup hierarchy */}
            {isH2 ? <h2>{title}</h2> : <h3>{title}</h3>}
          </div>
        </div>
        {(image && (image.asset || image.assetId)) ||
          typeof image === 'string' ? (
            <SanityFluidImage
              crop={image.crop}
              hotspot={image.hotspot}
              assetId={image.asset?._ref || image.assetId || image}
              className={styles.thumbnail}
              alt={`Thumbnail for resource: "${title}"`}
              fluidOptions={{ maxWidth: 398, sizes: RES_IMAGE_SIZES }}
              imgStyle={{ objectFit: 'contain' }}
            />
          ) : (
            <div className={styles.thumbnail_placeholder}>
              <img alt="Ambassador" src={ambassadorLogo} />
            </div>
          )}
      </Link>
    </article>
  );
};

export default ResourceLink;
