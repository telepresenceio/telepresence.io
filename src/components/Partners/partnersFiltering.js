import queryString from 'query-string';
import React from 'react';

export function usePartnersFiltering(data, location, skipUrlParams = false) {
  const allCategories = React.useMemo(() => data.categories?.nodes || [], [
    data,
  ]);
  const allPartners = React.useMemo(() => {
    const partners = data.partners?.nodes || [];
    const featured = (data.page?.featuredPartners || []).map((p) => p.name);
    return [
      // expand each featured partner
      ...featured.map((name) => partners.find((p) => p.name === name)),
      // remove featured partners from the rest
      ...partners.filter(({ name }) => featured.indexOf(name) < 0),
    ];
  }, [data]);

  // What is actually being rendered
  const [filteredPartners, setFiltered] = React.useState(allPartners);
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

      // When click on a partner card's category button, we want to only select that specific category, so we'll overwrite the rest
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
    // First, let's filter the desired partners
    setFiltered(
      allPartners.filter((partner) => {
        // If we don't have filters selected, then every partner is passable
        if (!chosenFilters.categories.length) {
          return true;
        }

        // If we don't have categories for the given partner, it'll only show up if we have every category chosen or none, otherwise we consider the user wants a specific set of categories of which this given partner is not a part of
        if (!partner.categories || !partner.categories.length) {
          if (chosenFilters.categories.length === allCategories.length) {
            return true;
          } else {
            return false;
          }
        }
        // If we find a category in the partner that is included in the chosenFilters.categories, then we know we can include it in the results
        if (
          !!partner.categories.find(
            ({ title }) => chosenFilters.categories.indexOf(title) >= 0,
          )
        ) {
          return true;
        }
        // Default to filtering the partner out of the final list
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
        `/partners?${queryString.stringify(newQuery)}`,
      );
    } else {
      // Clear the query if none found
      window.history.replaceState({}, '', '/partners');
    }
  }, [chosenFilters, allPartners, allCategories.length, skipUrlParams]);

  return {
    allPartners,
    categories: allCategories,
    filteredPartners,
    chosenFilters,
    chooseFilter,
  };
}
