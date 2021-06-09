import React from 'react';
import classnames from 'classnames';

import styles from './oldEventCard.module.less';
import Link from '../Link';
import RichText from '../RichText/RichText';
import { SanityFluidImage } from '../SanityImage/SanityImage';
import { EventDate } from './EventDate';

const OldEventCard = ({ isH2, meta, ...otherProps }) => {
  const { excerpt, startDate, endDate, url, title, slug, image } = meta;
  const assetId = typeof image === 'string' ? image : image?.asset?._ref;

  const finalUrl = slug?.current || url;
  return (
    <article
      className={classnames(
        styles.card,
        otherProps.isFeatured && styles.cardFeatured,
      )}
    >
      <EventDate startDate={startDate} endDate={endDate} />
      {assetId && (
        <Link className={styles.cardImg} to={finalUrl}>
          <SanityFluidImage
            assetId={assetId}
            fluidOptions={{ maxWidth: 600 }}
          />
        </Link>
      )}
      <div className={styles.content}>
        {isH2 ? <h2>{title}</h2> : <h3>{title}</h3>}
        {excerpt && <RichText blocks={excerpt} />}
      </div>
      <Link className={styles.overlayLink} to={finalUrl}>
        {/* invisible text for accessibility */}
        <span className="visually-hidden">Learn about the event {title}</span>
      </Link>
    </article>
  );
};

export default OldEventCard;
