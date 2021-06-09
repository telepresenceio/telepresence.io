import queryString from 'query-string';
import React from 'react';

export function useNewsFiltering(data, location, skipUrlParams = false) {
  const allCategories = React.useMemo(() => data.categories?.nodes || [], [
    data,
  ]);

  // Figure out the ids of news that will be featured
  const featured = React.useMemo(() => {
    const initial = data.page?.featuredNews?.map(({ _id }) => _id) || [];
    if (initial.length >= 2) {
      return initial;
    }
    // If we don't have enough featured news set by editors, let's use the most recent non-featured
    const firstNonFeatured = data.news?.nodes
      .filter(({ _id }) => initial.indexOf(_id) < 0)
      .slice(0, 2)
      .map(({ _id }) => _id);
    // If only 1 is featured, let's add only 1 non-featured
    if (initial.length === 1) {
      return [...initial, firstNonFeatured[0]];
    }
    return firstNonFeatured;
  }, [data]);

  const featuredNews = React.useMemo(
    () => featured.map((id) => data.news?.nodes?.find(({ _id }) => _id === id)),
    [data, featured],
  );
  const nonFeaturedNews = React.useMemo(
    () =>
      data.news?.nodes?.filter(({ _id }) => featured.indexOf(_id) < 0) || [],
    [data, featured],
  );

  // What is actually being rendered
  const [filteredNews, setFiltered] = React.useState(nonFeaturedNews);
  // Set initial filters to be empty
  const [chosenFilters, chooseFilters] = React.useState({
    categories: [],
  });

  function chooseFilter({ title, filterKey, soleSelection }) {
    // Get the current filters for this filter key/type
    const currentChoicesForFilter = chosenFilters[filterKey];
    // If none (a case that shouldn't happen), return to prevent errors
    if (!currentChoicesForFilter) {
      return;
    }
    return function (e) {
      e.preventDefault();

      // When click on a news card's category button, we want to only select that specific category, so we'll overwrite the rest
      if (soleSelection) {
        chooseFilters({
          ...chosenFilters,
          [filterKey]: [title],
        });
        return;
      }

      let newFilters;
      // Find the desired filter in the current chosen list
      const currIndex = currentChoicesForFilter.indexOf(title);
      // If already chosen, unchoose
      if (currIndex >= 0) {
        newFilters = [
          ...currentChoicesForFilter.slice(0, currIndex),
          ...currentChoicesForFilter.slice(currIndex + 1),
        ];
      }
      // If not present, add it
      else {
        newFilters = [...currentChoicesForFilter, title];
      }
      // And finally update
      chooseFilters({
        ...chosenFilters,
        [filterKey]: newFilters,
      });
    };
  }

  React.useEffect(
    () => {
      if (skipUrlParams) {
        return;
      }
      // Parse query strings on component mount and adjust filters accordingly
      const query = queryString.parse(location.search);
      let newCategories = chosenFilters.categories;
      if (Array.isArray(query.categories)) {
        newCategories = query.categories;
      } else if (typeof query.categories === 'string') {
        newCategories = [query.categories];
      }
      chooseFilters({
        categories: newCategories,
      });
    },
    /*eslint-disable */
    [
      // Empty deps as we only want to run this when the component mounts
      // However, the linter will yell at us for not including chosenFilters as
      // deps, so we disable it
    ],
    /*eslint-enable */
  );

  // Effect to run when filters or resources change
  React.useEffect(() => {
    // First, let's filter the desired news
    setFiltered(
      nonFeaturedNews.filter((news) => {
        // If we don't have filters selected, then every news is passable
        if (!chosenFilters.categories.length) {
          return true;
        }

        // If we don't have categories for the given news, it'll only show up if we have every category chosen or none, otherwise we consider the user wants a specific set of categories of which this given news is not a part of
        if (!news.meta?.category) {
          if (chosenFilters.categories.length === allCategories.length) {
            return true;
          } else {
            return false;
          }
        }
        // If we find a category in the news that is included in the chosenFilters.categories, then we know we can include it in the results
        if (chosenFilters.categories.indexOf(news.meta?.category?.title) >= 0) {
          return true;
        }
        // Default to filtering the news out of the final list
        return false;
      }),
    );

    if (skipUrlParams) {
      return;
    }
    // And then save these changes to the URL query string
    let newQuery = {};
    if (chosenFilters.categories.length > 0) {
      newQuery.categories = chosenFilters.categories;
    }
    // If any filter is selected, update the URL to match it
    if (newQuery.categories) {
      window.history.replaceState(
        {},
        '',
        `/about-us/news?${queryString.stringify(newQuery)}`,
      );
    } else {
      // Clear the query if none found
      window.history.replaceState({}, '', '/about-us/news');
    }
  }, [chosenFilters, nonFeaturedNews, allCategories.length, skipUrlParams]);

  return {
    featuredNews,
    categories: allCategories,
    filteredNews,
    chosenFilters,
    chooseFilter,
  };
}
