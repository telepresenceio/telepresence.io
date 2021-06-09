import React from 'react';

import ResourceCards from './ResourceCards/ResourceCards';

import styles from './filteredResources.module.less';

function cleanImgField(field, includePalette = false) {
  if (!field || !field.asset || !field.asset._id) {
    return field;
  }
  return {
    _type: field._type,
    assetId: field.asset._id,
    alt: field.alt,
    caption: field.caption,
    crop: field.crop,
    hotspot: field.hotspot,
    palette: includePalette ? field.asset.metadata.palette.dominant : undefined,
  };
}

export function getResourceForCard({ _type, ...rest }) {
  if (_type === 'externalResource') {
    return {
      _type,
      _updatedAt: rest._updatedAt,
      title: rest.title,
      url: rest.url,
      type: rest.type,
      image: cleanImgField(rest.image),
    };
  } else {
    const { meta = {} } = rest;
    return {
      _type,
      _updatedAt: rest._updatedAt,
      title: meta.title,
      url: meta.slug && meta.slug.current,
      type: meta.type,
      image: cleanImgField(meta.ogImage),
    };
  }
}

function filterPreviewResource({
  resource,
  topicRefs = [],
  typeRefs = [],
  relatedPartnersRefs = [],
  authorshipTypeRefs = [],
}) {
  if (typeRefs.length && typeRefs.indexOf(resource.typeRef) < 0) {
    return false;
  }
  if (
    authorshipTypeRefs.length &&
    authorshipTypeRefs.indexOf(resource.authorshipTypeRef) < 0
  ) {
    return false;
  }
  if (
    topicRefs.length &&
    !(resource.topicsRefs || []).find((ref) => topicRefs.indexOf(ref) >= 0)
  ) {
    return false;
  }
  if (
    relatedPartnersRefs.length &&
    !(resource.relatedPartnersRefs || []).find(
      (ref) => relatedPartnersRefs.indexOf(ref) >= 0,
    )
  ) {
    return false;
  }
  return true;
}

// How many resources to show per "page"
// Equals to 3 rows on desktop
const PAGINATION_SIZE = 9;

// This SVG is an arrow pointing right, so we want to flip it if isLeft
const SideArrow = ({ isLeft = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: isLeft ? `scaleX(-1)` : undefined }}
    viewBox="0 0 24 24"
  >
    <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z" />
  </svg>
);

const FilteredResources = ({
  body = [],
  title,
  hideType = false,
  resources: buildTimeResources,
  // for the preview
  topicRefs,
  typeRefs,
  relatedPartnersRefs,
  authorshipTypeRefs,
  allInternalResources,
  allExternalResources,
  isPreview = false,
}) => {
  const resources = React.useMemo(() => {
    if (isPreview) {
      const filteredInternal = (allInternalResources || []).filter((resource) =>
        filterPreviewResource({
          resource,
          topicRefs,
          typeRefs,
          relatedPartnersRefs,
          authorshipTypeRefs,
        }),
      );
      const filteredExternal = (allExternalResources || []).filter((resource) =>
        filterPreviewResource({
          resource,
          topicRefs,
          typeRefs,
          relatedPartnersRefs,
          authorshipTypeRefs,
        }),
      );
      return [...filteredInternal, ...filteredExternal]
        .map(getResourceForCard)
        .sort((a, b) => {
          return new Date(b._updatedAt) - new Date(a._updatedAt);
        });
    }
    return buildTimeResources || [];
  }, [
    buildTimeResources,
    allInternalResources,
    allExternalResources,
    topicRefs,
    typeRefs,
    isPreview,
    authorshipTypeRefs,
    relatedPartnersRefs,
  ]);

  // For scrolling when paginating:
  // We get the resource cards section
  const [sectionRef, setSectionRef] = React.useState(null);
  // And make sure we only scroll after mounting (see effect below)
  const hasMountedRef = React.useRef(false);

  // For pagination
  const [curPage, setPage] = React.useState(1);
  const pageNum = Math.ceil(resources.length / PAGINATION_SIZE);
  const prevPage = curPage - 1 === 0 ? undefined : curPage - 1;
  const nextPage = curPage + 1 > pageNum ? undefined : curPage + 1;

  React.useEffect(() => {
    if (sectionRef) {
      // We want to avoid scrolling when the component first mounts
      // We use useRef instead of useState to prevent unnecessary re-renders
      // See: https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
      if (!hasMountedRef || !hasMountedRef.current) {
        hasMountedRef.current = true;
      } else {
        // trycatch in case the browser doesn't support window.scrollTo
        try {
          window.scrollTo({
            behavior: 'smooth',
            top: sectionRef.current.offsetTop,
          });
        } catch (error) {}
      }
    }
  }, [curPage, sectionRef]);

  return (
    <ResourceCards
      hideType={hideType}
      title={title}
      body={body}
      resources={resources.slice(
        (curPage - 1) * PAGINATION_SIZE,
        curPage * PAGINATION_SIZE,
      )}
      isPreview={isPreview}
      setRef={setSectionRef}
    >
      <div className={styles.pagination}>
        {prevPage && (
          <button
            className={styles.prevButton}
            onClick={() => setPage(prevPage)}
          >
            <span className="visually-hidden">
              Go to previous {PAGINATION_SIZE} resources (page {prevPage})
            </span>
            <SideArrow isLeft={true} />
          </button>
        )}
        {pageNum > 1 && (
          <div className={styles.pageNumber}>
            <span className="visually-hidden">Page</span> {curPage} out of{' '}
            {pageNum}
          </div>
        )}
        {nextPage && (
          <button
            className={styles.nextButton}
            onClick={() => setPage(nextPage)}
          >
            <span className="visually-hidden">
              Go to next {PAGINATION_SIZE} resources (page {nextPage})
            </span>
            <SideArrow />
          </button>
        )}
      </div>
    </ResourceCards>
  );
};

export default FilteredResources;
