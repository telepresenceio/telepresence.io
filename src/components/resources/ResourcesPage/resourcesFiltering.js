import queryString from 'query-string';
import React from 'react';

import {
  parseSingleExternalRes,
  parseSingleNonExternalRes,
} from './resourcesUtils';

export function useResourcesFiltering(data, location) {
  const allTopics = React.useMemo(() => data.topics?.nodes || [], [data]);
  const allTypes = React.useMemo(() => data.types?.nodes || [], [data]);

  const allResources = React.useMemo(
     () => data.allResources.nodes.map((node) =>{
      if (node.parentType === 'externalResource') {
        return parseSingleExternalRes(node.parent);
      }
      return parseSingleNonExternalRes(node.parent, node.parentType);
    }),
    [data]
  );

  const pageResources = React.useMemo(() => {
    return data.resources.nodes.map((resource) => {
      if (resource.parentType === 'externalResource') {
        return parseSingleExternalRes(resource.parent);
      }
      return parseSingleNonExternalRes(resource.parent, resource.parentType);
    });
  }, [data.resources]);

  // What is actually being rendered
  const [filteredResources, setFiltered] = React.useState(pageResources);
  // Set initial filters to be empty
  const [chosenFilters, chooseFilters] = React.useState({
    topics: [],
    types: [],
  });

  function chooseFilter({ title, filterKey }) {
    // Get the current chosen filters for the given filter key
    const currentChoicesForFilter = chosenFilters[filterKey];
    // If none (a case that shouldn't happen), return to prevent errors
    if (!currentChoicesForFilter) {
      return;
    }
    return function (e) {
      e.preventDefault();
      let newFilters;
      // Find the desired filter in the current chosen list
      const currIndex = currentChoicesForFilter.indexOf(title);
      // If found in the array (already chosen), unchoose
      if (currIndex >= 0) {
        newFilters = [
          ...currentChoicesForFilter.slice(0, currIndex),
          ...currentChoicesForFilter.slice(currIndex + 1),
        ];
      }
      // If not present, add / choose it
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

  // For scrolling to the top of the page
  const hasMountedRef = React.useRef(null);
  const resultsHeadingRef = React.useRef(null);
  React.useEffect(() => {
    if (resultsHeadingRef) {
      // We want to avoid scrolling when the component first mounts
      // We use useRef instead of useState to prevent unnecessary re-renders
      // See: https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
      } else {
        // trycatch in case the browser doesn't support element.scrollIntoView's options
        try {
          resultsHeadingRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        } catch (error) {}
      }
    }
  }, [filteredResources, resultsHeadingRef]);

  // Effect to parse the query params and define initial filters on mount
  React.useEffect(
    () => {
      // Previously, the /resources page had a #user-stories anchor.
      // Here we're mapping it to the User Stories topic
      if (location.hash === '#user-stories') {
        chooseFilters({
          ...chosenFilters,
          topics: ['User Stories'],
        });
        // If we have this hash, we're good to start the component
        return;
      }
      // Parse query strings on component mount and adjust filters accordingly
      // We remove every forward slash (%2F when URL encoded) from location.search to prevent them being parsed as part of types and topics names.
      // This happens when people point to the website with a trailing slash after the query params, such as https://www.getambassador.io/resources/?types=Case%20Study/ (real case that broke the website)
      const query = queryString.parse(location.search.replace('%2F', ''));
      let newTopics = chosenFilters.topics;
      if (Array.isArray(query.topics)) {
        newTopics = query.topics;
      } else if (typeof query.topics === 'string') {
        newTopics = [query.topics];
      }
      let newTypes = chosenFilters.types;
      if (Array.isArray(query.types)) {
        newTypes = query.types;
      } else if (typeof query.types === 'string') {
        newTypes = [query.types];
      }
      if (
        newTopics.length !== chosenFilters.topics.length ||
        newTypes.length !== chosenFilters.types.length
      ) {
        chooseFilters({
          topics: newTopics,
          types: newTypes,
        });
      }
    },
    /*eslint-disable */
    [
      // Empty deps as we only want to run this when the component mounts
      // However, the linter will yell at us for not including chosenFilters as
      // deps, so we disable it
    ],
    /*eslint-enable */
  );

  // Effect to run when filters, curPage or resources change
  React.useEffect(
    () => {
      // If we have no chosen filters, then let's only filter by pagination
      if (!chosenFilters.topics.length && !chosenFilters.types.length) {
        setFiltered(pageResources);
      } else {
        // First, let's filter the desired partners
        setFiltered(
          allResources.filter((resource) => {
            // If we don't have the type in the chosenFilters.types array, filter out
            if (
              // If we don't have types selected, then every type is passable
              !!chosenFilters.types.length &&
              resource.type &&
              chosenFilters.types.indexOf(resource.type.title) < 0
            ) {
              return false;
            }

            // After dealing with types, if the resource passed and we don't have any topic selected, then there's no need for further checking
            if (!chosenFilters.topics.length) {
              return true;
            }

            // If we don't have topics for the given resource, it'll only show up if we have every topic chosen or none, otherwise we consider the user wants a specific set of topics of which this given resource is not a part of
            if (!resource.topics || !resource.topics.length) {
              if (chosenFilters.topics.length === allTopics.length) {
                return true;
              } else {
                return false;
              }
            }
            // If we find a topic in the resource that is included in the chosenFilters.topics, then we know we can include it in the results
            if (
              !!resource.topics.find(
                ({ title }) => chosenFilters.topics.indexOf(title) >= 0,
              )
            ) {
              return true;
            }
            // Default to filtering the resource
            return false;
          }),
        );
      }

      // And then save these changes to the URL query string
      let newQuery = {};
      if (chosenFilters.topics.length > 0) {
        newQuery.topics = chosenFilters.topics;
      }
      if (chosenFilters.types.length > 0) {
        newQuery.types = chosenFilters.types;
      }
      if (newQuery.types || newQuery.topics) {
        // If any filter is selected, update the URL to match it
        window.history.replaceState(
          {},
          '',
          `/resources/?${queryString.stringify(newQuery)}`,
        );
      } else {
        // Else remove query params from the URL
        window.history.replaceState({}, '', location.pathname);
      }
    },
    
    [chosenFilters, allResources, allTopics.length, allTypes.length],
    
  );

  return {
    allResources,
    topics: allTopics,
    types: allTypes,
    filteredResources,
    chosenFilters,
    chooseFilter,
    resultsHeadingRef,
  };
}
