import React from 'react';

import { BASE_URL, GH_URL, EDITIONS_URL, relativeToAbsUrl } from './urls';

// See Schema.org to understand what is going on in these functions
const ORG_ID = BASE_URL + '#organization';
const SOFTWARE_ID = BASE_URL + '#software';

function getFeaturesList({ features, edIndex }) {
  return (
    features
      // Only consider features with columns
      .filter((feat) => !!feat.columns && feat.columns.length)
      // "Feature title: value.text"; or
      // "Feature title: available"; or
      // "Feature title: unavailable"
      .map(({ columns, title }) => {
        const value = columns[edIndex];
        if (!value) {
          return '';
        }
        return `${title}: ${
          value.text || (value.check ? 'Available' : 'Unavailable')
        }`;
      })
      // Join it all in a string, as the featureList property demands
      // See: https://schema.org/featureList
      .join(', ')
  );
}

const AUTHOR_ORG = {
  '@type': 'Organization',
  '@id': ORG_ID,
  url: BASE_URL,
};

const SOFT_APP_BASE = {
  inLanguage: 'en',
  '@type': 'SoftwareApplication',
  applicationCategory: 'Cloud Software',
  applicationSubCategory: 'API Gateway',
  operatingSystem: 'Kubernetes 1.6 or later',
  // Separated by comma:
  keywords:
    'Kubernertes,API Gateway,Edge Stack,Envoy Proxy,Kubernetes Ingress,Load Balancer,Identity Aware Proxy,Developer Portal, microservices, open source',
  author: AUTHOR_ORG,
};

// The editions page contains `x` SoftwareApplications, all of which are a part of the main SoftwareApplication found in the homepage
function getEditionsSchema({ editions = [], features = [] }) {
  return {
    '@context': 'http://schema.org/',
    '@graph': editions.map((ed, edIndex) => ({
      ...SOFT_APP_BASE,
      name: `Ambassador Edge Stack - ${ed.title}`,
      // Each edition is part of the main Ambassador software, so they must link to it
      isPartOf: SOFTWARE_ID,
      featureList: getFeaturesList({ features, edIndex }),
      // Hide this property if not Open Source, as there are no fixed prices
      isAccessibleForFree: ed.title === 'Open Source' || undefined,
    })),
  };
}

const AMBASSADORS_SOCIAL_PRESENCE = [
  GH_URL,
  'https://blog.getambassador.io/',
  'http://www.twitter.com/getambassadorio',
];

// The home page contains 2 definitions: one for Ambassador the company and one for Ambassador the software (see below)
function getHomeSchema() {
  return {
    '@context': 'http://schema.org/',
    '@graph': [
      {
        // The homepage represents the organization Ambassador, a company, with a given logo, address, etc.
        '@type': 'Organization',
        name: 'Ambassador',
        url: BASE_URL,
        '@id': ORG_ID,
        sameAs: AMBASSADORS_SOCIAL_PRESENCE,
        logo: BASE_URL + 'images/ambassador-logo-black.svg',
        image: BASE_URL + 'images/logo.png',
        telephone: '617-982-3282',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '1 Lincoln Street, 31st Floor',
          postalCode: '02111',
          streetAddress: 'Boston',
        },
        // And the company also owns the software (see below)
        owns: {
          '@id': SOFTWARE_ID,
          url: SOFTWARE_ID,
        },
      },
      {
        // The homepage is also the biggest entry point for Ambassador the software, which has a description, categories, an author, some keywords, etc.
        ...SOFT_APP_BASE,
        url: BASE_URL,
        '@id': SOFTWARE_ID,
        name: 'Ambassador Edge Stack',
        screenshot: BASE_URL + 'images/aes-ui.png',
        description:
          'Ambassador is an open source, Kubernetes-native API Gateway for microservices built on theEnvoy Proxy. Ambassador allows you to control application traffic to your services with a declarative policy engine.',
        isAccessibleForFree: true,
        // The license page is where you can learn more about buying the software, which is the editions page
        // This property is pending on Schema, but if search engines don't support them, they'll simply ignore it
        acquireLicensePage: EDITIONS_URL,
        // Link to the releases page on GH
        releaseNotes: GH_URL + 'releases',
        // The featureList property and other product-related information, as tempting as it is to include them here, can't be included in the homepage, as there isn't any visible content related to it
      },
    ],
  };
}

function getPersonSchema({ name, role, image } = {}) {
  if (!name) {
    return {};
  }
  const splittedName = name.split(' ');
  return {
    '@context': 'http://schema.org/',
    '@type': 'Person',
    name,
    familyName:
      splittedName.length > 1
        ? splittedName[splittedName.length - 1]
        : undefined,
    jobTitle: role,
    affiliation: AUTHOR_ORG,
    image:
      (image && image.asset && image.asset.fluid && image.asset.fluid.src) ||
      undefined,
  };
}

// Pages are very plain
function getPageSchema({ title, description, author } = {}) {
  return {
    '@context': 'http://schema.org/',
    '@type': 'WebPage',
    inLanguage: 'en',
    name: title,
    description,
    author: author || AUTHOR_ORG,
  };
}

function getResourcesPageSchema({
  resources = [],
  title,
  description,
  author,
}) {
  return {
    '@context': 'http://schema.org/',
    '@type': ['WebPage', 'ItemList'],
    inLanguage: 'en',
    name: title,
    description,
    author: author || AUTHOR_ORG,
    itemListElement: resources
      .filter((res) => res.typeId !== 'externalResource')
      .map((res, i) => {
        return {
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            // Unfortunately, we can't have ListItems with different domain names in the same ItemList
            url: relativeToAbsUrl(res.url),
            name: res.title,
          },
        };
      }),
  };
}
function getPartnersPageSchema({ partners = [], title, description }) {
  return {
    '@context': 'http://schema.org/',
    '@type': ['WebPage', 'ItemList'],
    inLanguage: 'en',
    name: title,
    description,
    author: AUTHOR_ORG,
    itemListElement: partners.map((partner, i) => {
      return {
        '@type': 'ListItem',
        position: i + 1,
        name: partner.name,
        image: partner.logo?.asset?.fluid?.src,
        url: relativeToAbsUrl(partner.links[0]?.url),
      };
    }),
  };
}

const TYPE_SCHEMA_MAPPINGS = {
  page: getPageSchema,
  home: getHomeSchema,
  editions: getEditionsSchema,
  resourcesPage: getResourcesPageSchema,
  person: getPersonSchema,
  partnersPage: getPartnersPageSchema,
};

export const getSchemaJsonLD = ({ type = 'page', ...props } = {}) => {
  const getSchema = TYPE_SCHEMA_MAPPINGS[type];
  if (!getSchema) {
    return null;
  }
  return (
    <script type="application/ld+json">
      {JSON.stringify(getSchema(props))}
    </script>
  );
};

export default getSchemaJsonLD;
