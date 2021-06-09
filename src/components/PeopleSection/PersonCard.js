import React from 'react';

import styles from './styles.module.less';
import RichText from '../RichText/RichText';
import {
  LinkedinLogo,
  TwitterLogo,
  FacebookLogo,
  GithubLogo,
} from '../icons/socialIcons';
import { SanityFluidImage } from '../SanityImage/SanityImage';

export default ({ body: overwrittenBody, person, isH2 }) => {
  const { name, role, image, body: originalBody } = person;
  const body = overwrittenBody || originalBody;

  const getSocialTitle = (network) => `${name}'s profile on ${network}`;
  return (
    <div className={styles.person}>
      {image && image.asset && image.asset._ref && (
        <SanityFluidImage
          assetId={image.asset._ref}
          alt={`${name}'s photo`}
          fluidOptions={{ maxWidth: 200 }}
        />
      )}
      {isH2 ? (
        <h2 className={styles.name}>{name}</h2>
      ) : (
        <h3 className={styles.name}>{name}</h3>
      )}
      {role &&
        (isH2 ? (
          <h3 className={styles.role}>{role}</h3>
        ) : (
          <h4 className={styles.role}>{role}</h4>
        ))}
      {body && (
        <div className={styles.personInfo}>
          <RichText blocks={body} />
        </div>
      )}
      <div className={styles.social}>
        {person.linkedin && (
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={person.linkedin}
            title={getSocialTitle('LinkedIn')}
          >
            <LinkedinLogo />
          </a>
        )}
        {person.twitter && (
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={person.twitter}
            title={getSocialTitle('Twitter')}
          >
            <TwitterLogo />
          </a>
        )}
        {person.facebook && (
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={person.facebook}
            title={getSocialTitle('Facebook')}
          >
            <FacebookLogo />
          </a>
        )}
        {person.github && (
          <a
            target="_blank"
            rel="noreferrer noopener"
            href={person.github}
            title={getSocialTitle('Github')}
          >
            <GithubLogo />
          </a>
        )}
      </div>
    </div>
  );
};
