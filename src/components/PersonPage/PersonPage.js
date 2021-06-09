import React from 'react';
import Img from 'gatsby-image';

import ResourceLink from '../resources/ResourceLink';
import { parseNonExternalRes } from '../resources/ResourcesPage/resourcesUtils';

import styles from './styles.module.less';

export default ({ person, resourcePages, webinars }) => {
  const resources = React.useMemo(
    () => [
      ...parseNonExternalRes(webinars),
      ...parseNonExternalRes(resourcePages),
    ],
    [resourcePages, webinars],
  );
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          {person.image && person.image.asset && person.image.asset.fluid && (
            <Img
              fluid={person.image.asset.fluid}
              alt={`${person.name}'s photo`}
            />
          )}
          <div className={styles.personInfo}>
            <h1>{person.name}</h1>
            <p>{person.role}</p>
          </div>
        </div>
      </section>
      <section className={styles.resourcesWrapper}>
        <h2>Resources by {person.name}</h2>
        <div className={styles.resourcesContainer}>
          {resources.map(({ id, ...res }) => (
            <ResourceLink key={id} {...res} />
          ))}
        </div>
      </section>
    </main>
  );
};
