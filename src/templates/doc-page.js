import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Layout from '../components/Layout';

// Given a content string and a dict of variables, expand $variables$ in the string.
//
// https://github.com/gatsbyjs/gatsby/issues/10174#issuecomment-442513501
const template = (content, vars) => {
  return content.replace(/\$(\S+)\$/g, (match, key) => {
		const value = vars[key];
		if (typeof value !== 'undefined') {
			return value;
		}
		return match; // guards against some unintentional prefix
	});
}

export default function DocPage({ data, pathContext }) {
  return (
    <Layout>
      <Helmet>
        <title>{(data.markdownFile.childMdx.headings[0]||{}).value||"Docs"}</title>
        <meta name="description" content={data.markdownFile.childMdx.frontmatter.description} />
      </Helmet>
      <MDXRenderer>
        {template(data.markdownFile.childMdx.body, pathContext.variables)}
      </MDXRenderer>
    </Layout>
  )
}

export const query = graphql`
  query($markdownFileNodeID: String!) {
    markdownFile: file(id: { eq: $markdownFileNodeID }) {
      # We need the markdown file's relativePath for the "edit on GitHub" link.
      relativePath
      # But mostly we care about the MDX parse of the markdown file.
      childMdx {
        # Use "body" instead of "html" so that we can apply $variable$ expansion
        #  before rendering.
        body
        headings(depth: h1) {
          value
        }
        frontmatter {
          description
        }
      }
    }
  }
`
