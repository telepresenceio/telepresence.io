import React from 'react';
import classnames from 'classnames';

import styles from './newsListPage.module.less';

const CatBtn = ({ title, chosenFilters, chooseFilter }) => {
  const isChosen = chosenFilters.categories.indexOf(title) >= 0;
  return (
    <button
      onClick={chooseFilter({ title, filterKey: 'categories' })}
      className={classnames(styles.catBtn, isChosen && styles.catBtnActive)}
    >
      {title}
    </button>
  );
};

export default ({ categories, chosenFilters, chooseFilter }) => {
  const [isSticky, setSticky] = React.useState(false);
  const sectionEl = React.useRef(null);

  const toggleSticky = () => {
    // The section gets sticky at top: 60px
    const { top } = sectionEl.current.getBoundingClientRect();
    // so if its top is less than 70 (a healthy margin of error here), then we can assume it's sticky
    if (top <= 70) {
      setSticky(true);
    } else if (top > 70) {
      setSticky(false);
    }
  };

  React.useEffect(() => {
    // Categories will only be sticky in large screens
    if (window.innerWidth >= 940) {
      window.addEventListener('scroll', toggleSticky);
      return function () {
        window.removeEventListener('scroll', toggleSticky);
      };
    }
  }, [setSticky]);

  return (
    <section
      ref={sectionEl}
      aria-label="Categories of news"
      className={classnames(
        styles.categories,
        // If it's sticky, let's add a box-shadow to the section to separate it from the background
        isSticky && styles.categoriesSticky,
      )}
    >
      <div className={styles.categoriesContainer}>
        <h2>Filter by:</h2>
        {categories.map(({ title }) => (
          <CatBtn
            key={title}
            title={title}
            chosenFilters={chosenFilters}
            chooseFilter={chooseFilter}
          />
        ))}
      </div>
    </section>
  );
};
