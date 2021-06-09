const path = require('path');

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
  return result.data.file.id;
}

// Tell Gatsby to create web pages for each of the docs markdown files.
exports.createPages = async ({ loadNodeContent, graphql, actions }) => {
  // List all the markdown files...
  const result = await graphql(`
    query($sourceInstanceName: String!) {
      allFile(filter: {
        sourceInstanceName: { eq: $sourceInstanceName },
        ext: {eq: ".md"},
      }) {
        edges {
          node {
            id
            relativePath
          }
        }
      }
    }
  `, {
    sourceInstanceName: docsConfig.sourceInstanceName,
  });

  // ...and generate HTML pages for them
  let variablesCache = {};
  let sidebarCache = {};
  for (const { node } of result.data.allFile.edges) {

    const variablesFilepath = docsConfig.variablesFilepath(node);
    if (!(variablesFilepath in variablesCache)) {
      variablesCache[variablesFilepath] = await resolvePathToID({ graphql }, docsConfig.sourceInstanceName, variablesFilepath);
    }

    const sidebarFilepath = docsConfig.sidebarFilepath(node);
    if (!(sidebarFilepath in sidebarCache)) {
      sidebarCache[sidebarFilepath] = await resolvePathToID({ graphql }, docsConfig.sourceInstanceName, sidebarFilepath);
    }

    actions.createPage({
      // URL-path to create the page at
      path: docsConfig.urlpath(node),
      // Absolute filepath of the component to render the page with
      component: path.resolve('./src/templates/doc-page.js'),
      // Arguments to pass to that component's `query`
      context: {
        markdownFileNodeID:  node.id,
        variablesFileNodeID: variablesCache[variablesFilepath],
        sidebarFileNodeID:   sidebarCache[sidebarFilepath],
        docinfo: {
          docrootURL:   docsConfig.docrootURL(node),
          canonicalURL: docsConfig.canonicalURL(node),
          githubURL:    docsConfig.githubURL(node),

          maybeShowReadingTime: docsConfig.maybeShowReadingTime(node),
        },
      },
    });
  }
};
