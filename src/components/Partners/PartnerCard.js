import React from 'react';
import classnames from 'classnames';
import GatsbyImg from 'gatsby-image';

import Link from '../Link';
import RichText from '../RichText/RichText';

import styles from './partnerCard.module.less';
import pageStyles from './partnersPage.module.less';

export default ({
  name,
  type,
  categories = [],
  logo,
  body,
  links,
  chooseFilter,
  beingPreviewed = false,
  includeType,
}) => {
  return (
    <article
      className={classnames(
        styles.wrapper,
        beingPreviewed && styles.beingPreviewed,
      )}
    >
      <header>
        <h2 className={styles.title}>
          {logo && logo.asset && logo.asset.fluid ? (
            <GatsbyImg fluid={logo.asset.fluid} alt={`${name}'s logo`} />
          ) : (
            name
          )}
        </h2>
        <div className={styles.tags}>
          {Array.isArray(categories) &&
            categories.map(({ title }) => (
              <button
                onClick={chooseFilter({
                  title,
                  filterKey: 'categories',
                  soleSelection: true,
                })}
                key={title}
                className={classnames(
                  pageStyles.catBtn,
                  pageStyles.catBtnActive,
                  styles.cardCat,
                )}
              >
                {title}
              </button>
            ))}
          {type && type.title && includeType && (
            <div className={styles.typeLabel}>{type.title}</div>
          )}
        </div>
      </header>
      <main>
        {body && (
          <RichText
            className={styles.body}
            renderContainerOnSingleChild={true}
            blocks={body}
          />
        )}
      </main>
      <footer className={styles.links}>
        {links.map((link) => (
          <Link
            key={link.url}
            to={link.url}
            target={link.newWindow && '_blank'}
          >
            {link.label}
          </Link>
        ))}
      </footer>
    </article>
  );
};
