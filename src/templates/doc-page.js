import React from 'react';
import { graphql, navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import jsYAML from 'js-yaml';
import url from 'url';

import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';

import './doc-page.less';

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

const LinkList = ({ rooturl, items, className }) => {
  if (!items) {
    return null;
  }
  return (
    <ul className={className}>
      {
        items.map((item, i) => (
          <li key={i}>
            { item.link ? <a href={url.resolve(rooturl, item.link)}>{item.title}</a> : item.title }
            <LinkList rooturl={rooturl} items={item.items} />
          </li>
        ))
      }
    </ul>
  )
}

const handleVersionChange = (event) => {
  if (event.target.value) {
    navigate(event.target.value);
  }
};

export default function DocPage({ data, pageContext }) {
  const components = {
    // Override default markdown output.
    'pre': CodeBlock,

    // Add new custom components.
    // (none right now)
  };

  const title = data.markdownFile.childMdx.frontmatter.title ||
        (data.markdownFile.childMdx.headings[0]||{}).value ||
        "Docs";
  const description = data.markdownFile.childMdx.frontmatter.description ||
        data.markdownFile.childMdx.excerpt;
  const readingTime = data.markdownFile.childMdx.frontmatter.reading_time ||
        data.markdownFile.childMdx.fields.readingTime.text;

  const showReadingTime = pageContext.docinfo.maybeShowReadingTime &&
        !data.markdownFile.childMdx.frontmatter.frontmatter.hide_reading_time;

  const variables = jsYAML.safeLoad(data.variablesFile.internal.content);

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href={pageContext.docinfo.canonicalURL} />
        <title>{title} | {data.site.siteMetadata.title}</title>
        <meta name="og:title" content={title + " | " + data.site.siteMetadata.title} />
        <meta name="description" content={description} />
        <meta name="og:type" content="article" />
      </Helmet>
      <div className="docs">
        <nav className="docs__sidebar">
          <label className="docs__sidebar_version">
            Version:
            <select defaultValue="" onChange={handleVersionChange}>{ /* eslint-disable-line jsx-a11y/no-onchange */ }
            {
              pageContext.docinfo.peerVersions.reverse().map(([version, urlpath]) => (
                <option key={version} value={urlpath || ""}>{version}</option>
              ))
            }
            </select>
          </label>
          <LinkList className="docs__sidebar_toc"
                    rooturl={pageContext.docinfo.docrootURL}
                    items={jsYAML.safeLoad(template(data.sidebarFile.internal.content, variables))} />
        </nav>
        <main className="docs__main">
          {showReadingTime ? <span className="docs__reading-time">{readingTime}</span> : ''}
          <MDXProvider components={components}>
            <MDXRenderer>
              {template(data.markdownFile.childMdx.body, variables)}
            </MDXRenderer>
          </MDXProvider>
        </main>
        <footer className="docs__footer">
          <a href={pageContext.docinfo.githubURL} target="_blank" rel="noreferrer">Edit this page on GitHub</a>
        </footer>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($markdownFileNodeID: String!, $variablesFileNodeID: String!, $sidebarFileNodeID: String!) {
    site {
      siteMetadata {
        title
      }
    }

    markdownFile: file(id: { eq: $markdownFileNodeID }) {
      # We need the markdown file's relativePath for the "edit on GitHub" link.
      relativePath
      # But mostly we care about the MDX parse of the markdown file.
      childMdx {
        # Use "body" instead of "html" so that we can apply $variable$ expansion
        #  before rendering.
        body
        frontmatter {
          title
          description
          reading_time
          hide_reading_time
        }

        headings(depth: h1) {
          value # fallback for frontmatter.title
        }
        excerpt(pruneLength: 150, truncate: true) # fallback for frontmatter.description
        fields {
          readingTime {
            text # fallback for frontmatter.reading_time
          }
        }

      }
    }

    variablesFile: file(id: { eq: $variablesFileNodeID }) {
      internal {
        content
      }
    }

    sidebarFile: file(id: { eq: $sidebarFileNodeID }) {
      internal {
        content
      }
    }

  }
`
