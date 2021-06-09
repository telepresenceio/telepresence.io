import React from 'react';
import classnames from 'classnames';

import PersonCard from './PersonCard';
import RichText from '../RichText/RichText';

import sectionColors from '../colors.module.less';
import styles from './styles.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';

export default ({ title, body, people, ...visuals }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[visuals.bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  return (
    <section
      className={classnames(styles.wrapper, sectionColors[colorMapping.label])}
    >
      <div className={styles.container}>
        {title && <h2>{title}</h2>}
        {body && <RichText className={styles.body} blocks={body} />}
        <div className={classnames(styles.cardsContainer)}>
          {Array.isArray(people) &&
            people.length &&
            people.map((person, i) => (
              <PersonCard
                key={person.name || `person-${i}`}
                {...person}
                isH2={!title}
              />
            ))}
        </div>
      </div>
    </section>
  );
};
