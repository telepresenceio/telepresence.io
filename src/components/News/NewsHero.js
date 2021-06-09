import React from 'react';
import classnames from 'classnames';
import GatsbyImage from 'gatsby-image';

import RichText from '../RichText/RichText';
import SocialSharingButtons from '../SocialSharingButtons/SocialSharingButtons';
import Link from '../Link';

import styles from './newsHero.module.less';
import { getFluidProps } from '../../utils/sanity';

const NewsHero = (props) => {
  // We want to get the image dimensions and understand its orientation
  // Ex img _ref: image-78be3224f9d4455b78763d244a28a9266b6f21dd-620x629-png
  const [originalWidth, originalHeigth] = props.image?.asset?._ref
    .split('-')[2]
    .split('x') || [1, 1];
  const isImageHorizontal = originalWidth / originalHeigth >= 1.5;
  const imageFluidProps =
    props.image &&
    getFluidProps(
      { assetId: props.image.asset._ref, ...props.image },
      { maxWidth: isImageHorizontal ? 150 : 300 },
    );
  return (
    <section className={styles.wrapper}>
      <Link to="/about-us/news" className={styles.allNews}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M16 7H3.83l5.59-5.59L8 0 0 8l8 8 1.41-1.41L3.83 9H16V7z" />
        </svg>
        All News
      </Link>
      {imageFluidProps && (
        <GatsbyImage
          className={classnames(
            styles.image,
            isImageHorizontal && styles.imageHorizontal,
          )}
          fluid={imageFluidProps}
        />
      )}
      <h1 className={styles.title}>{props.title}</h1>
      {props.date && (
        <h2 className={styles.date}>
          {/* Visually hidden text for screen readers */}
          <span className="visually-hidden">Published on </span>
          {new Date(props.date).toLocaleDateString('en', {
            timeZone: 'utc',
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </h2>
      )}
      {props.excerpt && (
        <RichText
          blocks={props.excerpt}
          renderContainerOnSingleChild={true}
          className={styles.excerpt}
        />
      )}
      <SocialSharingButtons className={styles.social} />
    </section>
  );
};

export default NewsHero;
