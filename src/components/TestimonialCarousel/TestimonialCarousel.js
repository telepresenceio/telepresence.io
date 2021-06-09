import React from 'react';
import classnames from 'classnames';
import Link from '../Link';

import styles from './styles.module.less';
import { SanityFluidImage } from '../SanityImage/SanityImage';
import RichText from '../RichText/RichText';

const Testimonial = ({ isActive, children, ...item }) => (
  <blockquote className={classnames(styles.Quote, isActive && styles.Active)}>
    {item.body && (
      <RichText className={styles.quoteContent} blocks={item.body} />
    )}
    <footer className={styles.authorInfo}>
      <cite>
        {item.personImage && item.personImage.asset && (
          <SanityFluidImage
            assetId={item.personImage.asset}
            fluidOptions={{ maxWidth: 135 }}
            alt={`${item.personName}'s photo`}
            className={styles.personPhoto}
            imgStyle={{ objectPosition: 'center' }}
          />
        )}
        <p className={styles.Name}>{item.personName}</p>
        <span className={styles.Title}>
          {item.personRole},{' '}
          {item.companyWebsite ? (
            <Link to={item.companyWebsite}>{item.companyName}</Link>
          ) : (
            <span>{item.companyName}</span>
          )}
        </span>
        {children}
      </cite>
    </footer>
  </blockquote>
);

const TestimonialSlider = ({ items, logos }) => {
  const isSingleQuoteWithLogo =
    logos && logos.length === 1 && items.length === 1;

  const [currIdx, setIdx] = React.useState(0);
  const prev = () => {
    setIdx(currIdx <= 0 ? items.length - 1 : currIdx - 1);
  };
  const next = () => {
    setIdx(currIdx >= items.length - 1 ? 0 : currIdx + 1);
  };

  return (
    <div className={styles.QuoteSlider}>
      {items.length > 1 && (
        <button
          onClick={() => prev()}
          className={classnames(styles.Arrow, styles.Prev)}
          aria-label="Previous"
        >
          Previous
        </button>
      )}
      <div>
        {items.map((item, i) => (
          <Testimonial {...item} isActive={currIdx === i} key={item.personName}>
            {/* If only one logo, then display it under the author rather than up top */}
            {isSingleQuoteWithLogo && (
              <SanityFluidImage
                {...logos[0].image}
                className={styles.quoteLogo}
                fluidOptions={{ maxWidth: 120 }}
                alt={`${logos[0].companyName}'s logo`}
              />
            )}
          </Testimonial>
        ))}
      </div>
      {items.length > 1 && (
        <button
          onClick={() => next()}
          className={classnames(styles.Arrow, styles.Next)}
          aria-label="Next"
        >
          Previous
        </button>
      )}
    </div>
  );
};

const TestimonialCarousel = ({
  title,
  logos,
  // `items` was featured in the first implementation of this component as an inline Sanity object. As we moved into document references, they no longer make sense, so they're deprecated.
  // We're keeping them here for instances of testimonialCarousel that still use them.
  items: deprecated,
  testimonials,
}) => {
  const items = testimonials || deprecated || [];

  return (
    <section className={styles.Section}>
      <div className={styles.Container}>
        {title && <h2 className={styles.Subtitle}>{title}</h2>}
        <div
          className={classnames(
            styles.Quotes,
            !!logos.length && !items.length && styles.QuotesOnlyLogos,
          )}
        >
          {/* If only one logo, we'll show it inside the Testimonial, see TestimonialSlider */}
          {logos && logos.length > 1 && (
            <div className={styles.Logos}>
              {logos.map(({ image, companyName }) => (
                <SanityFluidImage
                  key={companyName}
                  {...image}
                  fluidOptions={{ maxWidth: 135 }}
                  alt={`${companyName}'s logo`}
                />
              ))}
            </div>
          )}
          {!!items.length && <TestimonialSlider items={items} logos={logos} />}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
