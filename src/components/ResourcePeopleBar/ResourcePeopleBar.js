import React from 'react';
import Img from 'gatsby-image';

import { getFixedProps } from '../../utils/sanity';

import styles from './styles.module.less';
import Link from '../Link';
import slugify from '../../utils/slugify';
import { getPathFromSlug, relativeToAbsUrl } from '../../utils/urls';
import { getSanityImageUrl } from '../SanityImage/SanityImage';

function PersonBadge({ name, image, role }) {
  return (
    <div className={styles.person}>
      {image && image.asset ? (
        <Img
          alt={`${name}'s photo`}
          fixed={
            image.asset.fixed ||
            getFixedProps(
              {
                assetId: image.asset._ref,
              },
              { width: 50, height: 50 },
            )
          }
        />
      ) : (
        <div className={styles.imgPlaceholder} />
      )}
      <div className={styles.personInfo}>
        <div>{name}</div>
        {role && <div>{role}</div>}
      </div>
    </div>
  );
}

function getPersonUrl(person) {
  return getPathFromSlug(`/people/${slugify(person.name || '')}/`);
}

export function getPeopleBarSchema(block) {
  return {
    author: block.people.map((person) => {
      if (!person || !person.name) {
        return undefined;
      }
      const splittedName = person.name.split(' ');
      return {
        '@type': 'Person',
        // First name
        name: splittedName[0],
        givenName: splittedName[0],
        // Last name
        familyName:
          splittedName.length > 1 && splittedName[splittedName.length - 1],
        sameAs: [person.linkedin, person.github, person.twitter].filter(
          // To prevent "undefined"s to show in the array, we filter inexistent profile URLs
          (url) => !!url,
        ),
        image: person.image ? getSanityImageUrl(person.image) : undefined,
        url: block.includeToProfile
          ? relativeToAbsUrl(getPersonUrl(person))
          : undefined,
      };
    }),
  };
}

export default ({ people = [], includeToProfile = false, publishDate }) => {
  const date = publishDate && new Date(publishDate);
  return (
    <section className={styles.wrapper}>
      {date && (
        <div className={styles.date}>
          Published on{' '}
          <span>
            {date.toLocaleDateString('en', {
              timeZone: 'UTC',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      )}
      <div className={styles.container}>
        {people.map((person) => {
          if (!person || !person.name) {
            return null;
          }
          if (includeToProfile) {
            return (
              <Link
                key={person.name}
                className={styles.link}
                to={getPersonUrl(person)}
              >
                <PersonBadge {...person} />
              </Link>
            );
          }
          return <PersonBadge key={person.name} {...person} />;
        })}
      </div>
    </section>
  );
};
