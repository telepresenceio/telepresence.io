import React from 'react';
import GatsbyImage from 'gatsby-image';

import RichText from '../RichText/RichText';
import SocialSharingButtons from '../SocialSharingButtons/SocialSharingButtons';
import { getFluidProps } from '../../utils/sanity';
import EventDate from './EventDate';

import styles from './eventHero.module.less';

const EventHero = (props) => {
  const imageFluidProps =
    props.image &&
    getFluidProps(
      { assetId: props.image.asset._ref, ...props.image },
      { maxWidth: 1250 },
    );
  return (
    <>
      {imageFluidProps && (
        <GatsbyImage className={styles.image} fluid={imageFluidProps} />
      )}
      <section className={styles.wrapper}>
        <h1 className={styles.title}>{props.title}</h1>
        <h2>
          <EventDate startDate={props.startDate} endDate={props.endDate} />
        </h2>
        {props.excerpt && (
          <RichText
            blocks={props.excerpt}
            renderContainerOnSingleChild={true}
            className={styles.excerpt}
          />
        )}
        <SocialSharingButtons className={styles.social} />
      </section>
    </>
  );
};

export default EventHero;
