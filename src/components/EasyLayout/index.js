import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

import Layout from '../Layout';

export default function EasyLayout({
  location,
  title,
  description,
  children,
}) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          siteURL
        }
      }
    }
  `);

  return (
    <Layout location={location}>
      <Helmet>
        <title>{title} | {data.site.siteMetadata.title}</title>
        <link rel="canonical" href={`${data.site.siteMetadata.siteURL}${location.pathname}`} />
        { description && <meta name="description" content={description} /> }
      </Helmet>
      {children}
    </Layout>
  );
}
