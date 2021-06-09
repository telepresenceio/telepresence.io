import { removeDoubleSlashes } from '../../../utils/urls';

// We need to standardize the data shape for both external and non-external resources. Refer to the GraphQL at the end of this document or to Gatsby's GraphiQL playground to understand the differences
export function parseNonExternalRes({ nodes }, typeId) {
  return nodes.map((node) => parseSingleNonExternalRes(node, typeId));
}

export function parseSingleNonExternalRes({ meta, id, _updatedAt }, typeId) {
  return {
    id,
    _updatedAt,
    title: meta.title,
    url: removeDoubleSlashes(`/${meta?.slug?.current}/`),
    topics: meta.topics,
    type: meta.type,
    typeId,
    image: meta.ogImage,
  };
}

export function parseExternalRes({ nodes }) {
  return nodes.map(parseSingleExternalRes);
}

export function parseSingleExternalRes(node) {
  return {
    ...node,
    typeId: 'externalResource',
  };
}
