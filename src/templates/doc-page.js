import React from 'react';
import { graphql, navigate } from 'gatsby';
import { Helmet } from 'react-helmet';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import url from 'url';

import Layout from '../components/Layout';
import Release from '../components/ReleaseNotes/Release';
import GithubIcon from '../images/github-icon.inline.svg';
import CodeBlock from '../components/CodeBlock';
import Link from '../components/Link';

import '@fontsource/inter';
import './doc-page.less';

const mdxComponents = {
  // Override default markdown output.
  'pre': CodeBlock,
  'a': Link,
  img({ children, ...props}) {
    if (props.src.indexOf('//') << 0) {
      props.src = '../'+props.src
    }
    // eslint-disable-next-line
    return <img {...props}>{children}</img>;
  },

  // Add new custom components.
  // (none right now)
};

// Given a content string and a dict of variables, expand $variables$ in the string.
//
// https://github.com/gatsbyjs/gatsby/issues/10174#issuecomment-442513501
const template = (content, vars) => {
  if (content === null || vars === null) {
    return '';
  }
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
}) => {
  const title = mdxNode.frontmatter.title ||
        mdxNode.headings[0]?.value ||
        "Docs";
  const description = mdxNode.frontmatter.description ||
        mdxNode.excerpt;

  return (
    <>
      <Helmet>
        <title>{title} | {siteTitle}</title>
        <meta name="og:title" content={title + " | " + siteTitle} />
        <meta name="description" content={description} />
      </Helmet>
      <MDXProvider components={mdxComponents}>
        <MDXRenderer>
          {template(mdxNode.body, variables)}
        </MDXRenderer>
      </MDXProvider>
    </>
  );
};

const ReleaseNotesContent = ({
  releaseNotes,
  variables,
  siteTitle,
  onClick,
}) => {
  return (
    <>
      <Helmet>
        <title>{releaseNotes.docTitle} | {siteTitle}</title>
        <meta name="og:title" content={releaseNotes.docTitle + " | " + siteTitle} />
        <meta name="description" content={releaseNotes.docDescription} />
      </Helmet>
      <h1>{releaseNotes.docTitle}</h1>
      {
        releaseNotes.items.map((release) => (
          <Release key={release.version} release={release} versions={variables} onClick={onClick} />
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

const DocPage = props => {
  const { location, data, pageContext } = props;
  const { docinfo, variables, sidebar, releaseNotes } = pageContext;

  return (
    <Layout location={location}>
      <Helmet>
        <link rel="canonical" href={docinfo.canonicalURL} />
        <meta name="og:type" content="article" />
      </Helmet>
      <div className="docs">
        <nav className="docs__sidebar">
          <label className="docs__sidebar_version">
            Version:
            <select defaultValue="" onChange={handleVersionChange}>{ /* eslint-disable-line jsx-a11y/no-onchange */ }
            {
              docinfo.peerVersions.reverse().map(([version, urlpath]) => (
                <option key={version} value={urlpath || ""}>{version}</option>
              ))
            }
            </select>
          </label>
          <LinkList className="docs__sidebar_toc"
                    rooturl={docinfo.docrootURL}
                    items={sidebar} />
        </nav>
        <main className="docs__main">
          {
            data.contentFile.childMdx
              ? <MarkdownContent mdxNode={data.contentFile.childMdx}
                                 variables={variables}
                                 siteTitle={data.site.siteMetadata.title} />
              : <ReleaseNotesContent releaseNotes={releaseNotes}
                                     variables={variables}
                                     siteTitle={data.site.siteMetadata.title} />
          }
        </main>
        <footer className="docs__footer">
          <div>
            <a href={docinfo.githubURL} className="github"
               target="_blank" rel="noreferrer">
              <GithubIcon/>
              Edit this page on GitHub
            </a>
          </div>
          <div className="trademarkUsage">
            <p>
              The Linux Foundation has registered trademarks and uses
              trademarks. For a list of trademarks of The Linux Foundation,
              please see our <a
              href="https://www.linuxfoundation.org/legal/trademark-usage">Trademark
              Usage page</a>.
            </p>
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export default DocPage

export const query = graphql`
  query($contentFileNodeID: String!) {
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
      }
      # But in some cases (namely: release-notes.yml) it's not actually a markdown file.
      internal {
        content
      }
    }
  }
`
