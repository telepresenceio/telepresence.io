import React from 'react';
import classnames from 'classnames';

import styles from './newsCard.module.less';
import Link from '../Link';
import Button from '../Button';
import RichText from '../RichText/RichText';
import { SanityFluidImage } from '../SanityImage/SanityImage';
import { getPathFromSlug } from '../../utils/urls';

const NewsCard = ({ isH2, meta, isFeatured }) => {
  const { excerpt, date, url, title, slug, image } = meta;
  const assetId = typeof image === 'string' ? image : image?.asset?._ref;

  const finalUrl = slug?.current ? getPathFromSlug(slug.current) : url;
  const ctaLabel = meta.ctaLabel || 'Full article';
  return (
    <article
      className={classnames(
        styles.card,
        isFeatured ? styles.cardFeatured : styles.cardRegular,
      )}
    >
      <div className={classnames(styles.tag, isFeatured && styles.tagFeatured)}>
        {meta.category?.title || 'News'}
      </div>
      <header className={styles.cardHeader}>
        {assetId && (
          <Link className={styles.cardImg} to={finalUrl}>
            <SanityFluidImage
              assetId={assetId}
              fluidOptions={{ maxWidth: 600 }}
            />
          </Link>
        )}
        {isH2 ? (
          <h2>
            <Link to={finalUrl}>{title}</Link>
          </h2>
        ) : (
          <h3>
            <Link to={finalUrl}>{title}</Link>
          </h3>
        )}
        {date && (
          <p className={styles.date}>
            {/* Visually hidden text for screen readers */}
            <span className="visually-hidden">Published on </span>
            {new Date(date).toLocaleDateString('en', {
              timeZone: 'utc',
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </p>
        )}
      </header>
      <main className={styles.main}>
        {excerpt && <RichText blocks={excerpt} />}
      </main>
      {finalUrl && (
        <footer className={styles.footer}>
          {isFeatured ? (
            <Link className={styles.featuredLink} to={finalUrl}>
              {ctaLabel}
            </Link>
          ) : (
            <Button to={finalUrl} color="red-outline" size="sm">
              {ctaLabel}
            </Button>
          )}
        </footer>
      )}
    </article>
  );
};

export default NewsCard;
