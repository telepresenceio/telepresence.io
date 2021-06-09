import React from 'react';
import Helmet from 'react-helmet';

import { getOriginalImgUrl } from '../../utils/sanity';
import { getPageInfo } from '../../utils/pageUtils';
import getSchemaJsonLD from '../../utils/schema';
import { getPeopleBarSchema } from '../ResourcePeopleBar/ResourcePeopleBar';
import { relativeToAbsUrl } from '../../utils/urls';

export default ({
  meta,
  canonicalUrl,
  schema: propsSchema = { type: 'page' },
  body = [],
}) => {
  const { title } = getPageInfo(meta);
  const description = meta.seoDescription;
  // If we have a People Bar block in the page's body, then we must add its people to the page's schema
  const authorshipSchema = React.useMemo(() => {
    const peopleBar = body.find((block) => block._type === 'resourcePeopleBar');
    if (!peopleBar || !peopleBar.people) {
      return {};
    }
    return getPeopleBarSchema(peopleBar);
  }, [body]);
  const schema = {
    ...authorshipSchema,
    ...propsSchema,
  };
  // the canonicalUrl prop is built automatically from the page's slug/path,
  // while meta.canonicalUrl can be overwritten by editors in the CMS
  const definitiveCanonical =
    meta.canonicalUrl ||
    canonicalUrl ||
    (meta.slug?.current && relativeToAbsUrl(meta.slug.current));
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="og:title" content={title} />
      <meta name="og:type" content="website" />
      {meta.seoDescription && <meta name="description" content={description} />}
      {meta.ogImage && meta.ogImage.asset && meta.ogImage.asset._ref && (
        <meta
          name="og:image"
          content={getOriginalImgUrl(meta.ogImage.asset._ref)}
        />
      )}
      {meta.indexable === false && (
        <meta name="robots" content="noindex nofollow" />
      )}
      {definitiveCanonical && (
        <link rel="canonical" href={definitiveCanonical} />
      )}
      {getSchemaJsonLD({ title, description, ...schema })}
    </Helmet>
  );
};
