import React from 'react';
import { Link, graphql, navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import jsYAML from 'js-yaml';
import url from 'url';

import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';
import Release from '../components/ReleaseNotes/Release';
import GithubIcon from '../images/github-icon.inline.svg';
import "@fontsource/inter"

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

const MarkdownContent = ({
  mdxNode,
  variables,
  siteTitle,
  maybeShowReadingTime,
}) => {
  const components = {
    // Override default markdown output.
    'pre': CodeBlock,

    // Add new custom components.
    // (none right now)
  };

  const title = mdxNode.frontmatter.title ||
        mdxNode.headings[0]?.value ||
        "Docs";
  const description = mdxNode.frontmatter.description ||
        mdxNode.excerpt;
  const readingTime = mdxNode.frontmatter.reading_time ||
        mdxNode.fields.readingTime.text;

  const showReadingTime = maybeShowReadingTime &&
        !mdxNode.frontmatter.frontmatter.hide_reading_time;

  return (
    <>
      <Helmet>
        <title>{title} | {siteTitle}</title>
        <meta name="og:title" content={title + " | " + siteTitle} />
        <meta name="description" content={description} />
      </Helmet>
      {showReadingTime ? <span className="docs__reading-time">{readingTime}</span> : ''}
      <MDXProvider components={components}>
        <MDXRenderer>
          {template(mdxNode.body, variables)}
        </MDXRenderer>
      </MDXProvider>
    </>
  );
};

const ReleaseNotesContent = ({
  fileNode,
  variables,
  siteTitle,
}) => {
  const content = jsYAML.safeLoad(template(fileNode.internal.content, variables))

  return (
    <>
      <Helmet>
        <title>{content.docTitle} | {siteTitle}</title>
        <meta name="og:title" content={content.docTitle + " | " + siteTitle} />
        <meta name="description" content={content.docDescription} />
      </Helmet>
      <h1>{content.docTitle}</h1>
      { content.changelog &&
        <p>For a detailed list of all the changes in past releases, please
           consult the <Link to={content.changelog}>CHANGELOG</Link>.</p> }
      {
        content.items.map((release) => (
          <Release key={release.version}
                   release={release} />
        ))
      }
    </>
  );
};

const handleVersionChange = (event) => {
  if (event.target.value) {
    navigate(event.target.value);
  }
};

export default function DocPage({ data, pageContext }) {
  const variables = jsYAML.safeLoad(data.variablesFile.internal.content);

  return (
    <Layout>
      <Helmet>
        <link rel="canonical" href={pageContext.docinfo.canonicalURL} />
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
          {
            data.contentFile.childMdx
              ? <MarkdownContent mdxNode={data.contentFile.childMdx}
                                 variables={variables}
                                 siteTitle={data.site.siteMetadata.title}
                                 maybeShowReadingTime={pageContext.docinfo.maybeShowReadingTime} />
              : <ReleaseNotesContent fileNode={data.contentFile}
                                     variables={variables}
                                     siteTitle={data.site.siteMetadata.title} />
          }
        </main>
            <footer className="docs__footer">
            <a href={pageContext.docinfo.githubURL} className="github" target="_blank" rel="noreferrer">
                <GithubIcon />
                Edit this page on GitHub
            </a>
        </footer>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($contentFileNodeID: String!, $variablesFileNodeID: String!, $sidebarFileNodeID: String!) {
    site {
      siteMetadata {
        title
      }
    }

    contentFile: file(id: { eq: $contentFileNodeID }) {
      # We need the content file's relativePath for the "edit on GitHub" link.
      relativePath
      # But mostly we care about the MDX parse of the file.
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
      # But in some cases (namely: release-notes.yml) it's not actually a markdown file.
      internal {
        content
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
