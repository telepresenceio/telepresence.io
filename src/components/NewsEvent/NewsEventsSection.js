import React from 'react';
import classnames from 'classnames';

import RichText from '../RichText/RichText';

import sectionColors from '../colors.module.less';
import styles from './styles.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';
import OldEventCard from '../Events/OldEventCard';
import NewsCard from '../News/NewsCard';

export default ({ title, body, newsEventsList, ...visuals }) => {
  const colorMapping =
    SECTION_COLOR_MAPPINGS[visuals.bgColor] || SECTION_COLOR_MAPPINGS['#fff'];
  return (
    <section
      className={classnames(styles.wrapper, sectionColors[colorMapping.label])}
    >
      <div className={styles.container}>
        {title && <h2>{title}</h2>}
        {body && <RichText blocks={body} className={styles.body} />}
        <div className={classnames(styles.cardsContainer)}>
          {Array.isArray(newsEventsList) &&
            newsEventsList.length &&
            newsEventsList.map((item = {}, i) => {
              if (item._type === 'news') {
                return <NewsCard key={item._id} {...item} />;
              } else if (item._type === 'event') {
                return <OldEventCard key={item._id} {...item} />;
              } else return null;
            })}
        </div>
      </div>
    </section>
  );
};
