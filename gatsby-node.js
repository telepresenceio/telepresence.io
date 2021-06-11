const path = require('path');
const fs = require('fs');

const docsConfig = require('./docs-config');

// Some of the files in the docs subtrees want to import site-global
// things from the 'src/' directory.  Let them do this with the
// "@src/" alias, instead of making them learn how many "../" to put
// to get up to the root.
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
      },
    },
    // https://github.com/gatsbyjs/gatsby/issues/564
    node: {
      fs: 'empty',
    },
  });
};

exports.onCreateNode = async ({ node, loadNodeContent, actions }) => {
  if (node.internal.type === 'File' && node.sourceInstanceName === docsConfig.sourceInstanceName && node.ext === ".yml") {
    // Call loadNodeContent to force-populate node.internal.content, because
    // gatsby-source-filesystem is just a little too lazy about populating it,
    // because otherwise it doesn't get populated even though doc-page.js asks
    // for it.
    await loadNodeContent(node);
  }
};

// resolvePathToID takes a filepath, and resolves it to a node ID.
async function resolvePathToID(helpers, sourceInstanceName, relativePath) {
  let result = await helpers.graphql(`
    query($sourceInstanceName: String!, $relativePath: String!) {
      file(
        sourceInstanceName: { eq: $sourceInstanceName },
        relativePath: {eq: $relativePath },
      ) {
        id
      }
    }
    `, {
      sourceInstanceName: sourceInstanceName,
      relativePath: relativePath,
    });
  return result.data.file?.id;
}

// Tell Gatsby to create web pages for each of the docs markdown files.
exports.createPages = async ({ loadNodeContent, graphql, actions }) => {
  // List all the markdown files...
  const result = await graphql(`
    query($sourceInstanceName: String!) {
      pageFiles: allFile(filter: {
        sourceInstanceName: { eq: $sourceInstanceName },
        base: { regex: "/^(.*[.]md|releaseNotes[.]yml)$/" },
      }) {
        edges {
          node {
            id
            relativePath
          }
        }
      }
      staticFiles: allFile(filter: {
            extension: { in: [ "jpg", "png" ] }
      }) {
        edges {
          node {
            relativePath
            absolutePath
          }
        }
      }
    }
  `, {
    sourceInstanceName: docsConfig.sourceInstanceName,
  });

  // ...create a list of all HTML pages that we are going to for them...
  let allURLPaths = new Set();
  for (const { node } of result.data.pageFiles.edges) {
    allURLPaths.add(docsConfig.urlpath(node));
  }

  // ...and finally generate HTML pages for them.
  let variablesCache = {};
  let sidebarCache = {};
  for (const { node } of result.data.pageFiles.edges) {

    const variablesFilepath = docsConfig.variablesFilepath(node);
    if (!(variablesFilepath in variablesCache)) {
      variablesCache[variablesFilepath] = await resolvePathToID({ graphql }, docsConfig.sourceInstanceName, variablesFilepath);
    }

    const sidebarFilepath = docsConfig.sidebarFilepath(node);
    if (!(sidebarFilepath in sidebarCache)) {
      sidebarCache[sidebarFilepath] = await resolvePathToID({ graphql }, docsConfig.sourceInstanceName, sidebarFilepath);
    }

    const urlpath = docsConfig.urlpath(node);

    actions.createPage({
      // URL-path to create the page at
      path: urlpath,
      // Absolute filepath of the component to render the page with
      component: path.resolve('./src/templates/doc-page.js'),
      // Arguments to pass to that component's `query`
      context: {
        contentFileNodeID:   node.id,
        variablesFileNodeID: variablesCache[variablesFilepath],
        sidebarFileNodeID:   sidebarCache[sidebarFilepath],
        docinfo: {
          docrootURL:   docsConfig.docrootURL(node),
          canonicalURL: docsConfig.canonicalURL(node),
          githubURL:    docsConfig.githubURL(node),

          maybeShowReadingTime: docsConfig.maybeShowReadingTime(node),

          peerVersions: docsConfig.peerVersions(urlpath, allURLPaths),
        },
      },
    });
  }

  // This part makes me super uncomfortable, and I'm sure there's a better way
  // to do it that we should find.
  for (const { node } of result.data.staticFiles.edges) {
    const src = node.absolutePath;
    const dst = path.join('public', docsConfig.urlpath(node).replaceAll(path.posix.sep, path.sep));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
};
