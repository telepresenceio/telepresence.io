import React from 'react';

import NewsCard from './NewsCard';
import styles from './nextPrevNews.module.less';

const NextPrevNews = ({ next, prev }) => {
  return (
    <aside className={styles.wrapper}>
      {prev?.nodes?.length && (
        <div>
          <h2>Previous news</h2>
          {prev.nodes.map((item) => (
            <NewsCard
              key={item._id}
              {...item}
              isFeatured={false}
              isH2={false}
            />
          ))}
        </div>
      )}
      {next?.nodes?.length > 0 &&
        (!prev?.nodes?.length ||
          next.nodes[0]?._id !== prev?.nodes[0]?._id) && (
          <div>
            <h2>Next news</h2>
            {next.nodes.map((item, i) => (
              <NewsCard
                key={item._id}
                {...item}
                isFeatured={false}
                isH2={false}
              />
            ))}
          </div>
        )}
    </aside>
  );
};

export default NextPrevNews;
