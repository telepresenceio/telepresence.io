import classnames from 'classnames';
import React from 'react';

import styles from './BuzzBand.module.less';
import RichText from '../RichText/RichText';
import { SanityFluidImage } from '../SanityImage/SanityImage';
import Link from '../Link';

const BuzzBand = (p) => {
  return (
    <section className={styles.wrapper}>
      <div className={classnames(styles.card, styles.left)}>
        <div className={styles.announcing}>
          <svg
            viewBox="0 0 23 21"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.5217 13.3043L18.087 21L11.1739 17.1304L4.26087 21L5.82609 13.3043L0 8L7.86957 7.08696L11.1739 0L14.4783 7.13043L22.3478 8.04348L16.5217 13.3043Z" />
          </svg>
          Announcing
        </div>
        <div>
          {p.leftImage?.assetId && (
            <SanityFluidImage
              {...p.leftImage}
              fluidOptions={{ maxWidth: 150 }}
            />
          )}
          <h2>{p.leftTitle}</h2>
          {p.leftBody && (
            <RichText blocks={p.leftBody} renderContainerOnSingleChild={true} />
          )}
          {p.leftCta && (
            <Link to={p.leftCta.url} target={p.leftCta.newWindow && '_blank'}>
              {p.leftCta.label}
            </Link>
          )}
        </div>
      </div>
      <div className={classnames(styles.card, styles.right)}>
        <div>
          {p.rightImage?.assetId && (
            <SanityFluidImage
              {...p.rightImage}
              fluidOptions={{ maxWidth: 150 }}
            />
          )}
          <h2>{p.rightTitle}</h2>
          {p.rightBody && (
            <RichText
              blocks={p.rightBody}
              renderContainerOnSingleChild={true}
            />
          )}
          {p.rightCta && (
            <Link to={p.rightCta.url} target={p.rightCta.newWindow && '_blank'}>
              {p.rightCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default BuzzBand;
