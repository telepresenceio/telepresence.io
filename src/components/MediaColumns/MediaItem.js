import React from 'react';
import GatsbyImage from 'gatsby-image';
import classnames from 'classnames';

import Button from '../Button';
import styles from './styles.module.less';
import RichText from '../RichText/RichText';

// **bold string**
export const boldString = (str) => {
  return str.replace(
    /\*\*(.*?)\*\*/gim,
    (s) => `<strong>${s.replace(/\*\*/g, '')}</strong>`,
  );
};

// _italicized string_
export const italicizeString = (str) => {
  return str.replace(/_(.*?)_/gim, (s) => `<em>${s.replace(/_/g, '')}</em>`);
};

function StringParagraph({ str }) {
  const paragraphs = str
    // Split on line breaks to create an array
    .split('\n')
    // And filter out empty paragraphs
    .filter((p) => !!p);
  return (
    <>
      {paragraphs.map((p, i) => {
        const html = italicizeString(boldString(p));
        return (
          <p key={`p-${i}`} dangerouslySetInnerHTML={{ __html: html }}></p>
        );
      })}
    </>
  );
}

export default ({
  title,
  imageWidth,
  maxImgHeight,
  alignCenter,
  cta,
  ...i
}) => {
  const alt = i.image && i.image.alt;
  const ariaHidden = !alt;
  return (
    <div
      key={title}
      className={classnames(styles.item, alignCenter ? styles.itemCenter : '')}
    >
      <div
        className={styles.imageWrapper}
        style={{ width: imageWidth, height: maxImgHeight }}
      >
        {i.fixed && (
          <GatsbyImage fixed={i.fixed} alt={alt} aria-hidden={ariaHidden} />
        )}
        {i.svgUrl && (
          <img
            style={{ width: '100%' }}
            src={i.svgUrl}
            alt={alt}
            aria-hidden={ariaHidden}
          />
        )}
      </div>
      <div className={styles.itemContent}>
        <h3>{title}</h3>
        {/* i.body is a plain string, not portable text. i.richBody will become the default field as we slowly migrate over */}
        {i.richBody ? (
          <RichText blocks={i.richBody} />
        ) : (
          i.body && <StringParagraph str={i.body} />
        )}
        {/* item CTA */}
        {cta && cta.label && cta.url && (
          <Button
            to={cta.url}
            color={i.buttonColor}
            newWindow={cta.newWindow}
            size="sm"
          >
            {cta.label}
          </Button>
        )}
      </div>
    </div>
  );
};
