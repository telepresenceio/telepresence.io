const path = require('path');
const jsYaml = require('js-yaml');

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

const config = {
  urlpath: (node) => {
    // We have `node.relativePath` path relative to the `options.path` given in
    // to the gatsby-source-filesystem instance in `gatsby-config.js`; so
    // `./docs/v2.2/howtos/intercepts.md` has
    // `node.relativePath="v2.2/howtos/intercepts.md"`.
    //
    // We need to get from that relative filepath to the URL-path of the
    // resulting web page (with a trailing slash, since Gatsby is opinionated).
    return 'docs/' + (node.relativePath.
                      replaceAll(path.sep, path.posix.sep).
                      replace(/\/index\.md$/, '/').
                      replace(/\.md$/, '/'));
  },
  variablesFilepath: (node) => {
    // Which YAML file (relative to `options.path`, same as above) contains the
    // variable definitions that we should use for expanding $variables$ in this
    // markdown file?  If the YAML file doesn't exist, no variables with be
    // expanded.
    return path.join(node.relativePath.split(path.sep)[0], 'versions.yml');
  },
  sidebarFilepath: (node) => {
    return path.join(node.relativePath.split(path.sep)[0], 'doc-links.yml');
  },
  canonicalURL: (node) => {
    const urlpath = config.urlpath(node);
    const relpath = urlpath.split(path.posix.sep).slice(2).join(path.posix.sep);
    return `https://www.getambassador.io/docs/telepresence/latest/${relpath}`;
  },
  githubURL: (node) => {
    let versionPart = node.relativePath.split(path.sep)[0];
    if (versionPart === 'pre-release') {
      versionPart = 'master';
    }
    const branch = `products/telepresence/${versionPart}`;
    const filePart = node.relativePath.split(path.sep).slice(1).join(path.posix.sep);
    return `https://github.com/datawire/ambassador-docs/blob/${branch}/${filePart}`;
  },
  version: (node) => {
    return node.relativePath.split(path.sep)[0];
  },
  maybeShowReadingTime: (node) => {
    return false;
  }
};

async function readYAML(helpers, sourceInstanceName, relativePath) {
  // Part of me thinks this is disgusting, and to just hit the filesystem
  // directly.  But really, if we keep this nice and hermetic it will save us
  // headaches down the road.
  let subResult = await helpers.graphql(`
        query($sourceInstanceName: String!, $relativePath: String!) {
          file(
            sourceInstanceName: { eq: $sourceInstanceName },
            relativePath: {eq: $relativePath },
          ) {
            # loadNodeContent needs internal.owner to determine which
            # plugin to dispatch to.
            internal {
              owner
            }
            # The gatsby-source-filesystem plugin needs absolutePath
            absolutePath
            id
          }
        }
      `, {
        sourceInstanceName: sourceInstanceName,
        relativePath: relativePath,
      });
  if (!subResult.data.file) {
    return {}
  } else {
    const yamlStr = await helpers.loadNodeContent(subResult.data.file);
    const yamlObj = await jsYaml.safeLoad(yamlStr);
    return yamlObj
  }
}

// Tell Gatsby to create web pages for each of the docs markdown files.
exports.createPages = async ({ loadNodeContent, graphql, actions }) => {
  // The gatsby-source-filesystem's options.name from gatsby-config.js
  const sourceInstanceName = "docs";

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
    sourceInstanceName: sourceInstanceName,
  });

  // ...and generate HTML pages for them
  let variablesCache = {};
  let sidebarCache = {};
  for (const { node } of result.data.allFile.edges) {
    const variablesFilepath = config.variablesFilepath(node);
    const sidebarFilepath = config.sidebarFilepath(node);

    if (!(variablesFilepath in variablesCache)) {
      variablesCache[variablesFilepath] = await readYAML({ loadNodeContent, graphql }, sourceInstanceName, variablesFilepath)
    }

    if (!(sidebarFilepath in sidebarCache)) {
      sidebarCache[sidebarFilepath] = await readYAML({ loadNodeContent, graphql }, sourceInstanceName, sidebarFilepath)
    }

    actions.createPage({
      // URL-path to create the page at
      path: config.urlpath(node),
      // Absolute filepath of the component to render the page with
      component: path.resolve('./src/templates/doc-page.js'),
      // Arguments to pass to that component's `query`
      context: {
        markdownFileNodeID: node.id,
        docinfo: {
          variables: variablesCache[variablesFilepath],
          sidebar: sidebarCache[sidebarFilepath],
          canonicalURL: config.canonicalURL(node),
          githubURL: config.githubURL(node),
          version: config.version(node),
          maybeShowReadingTime: config.maybeShowReadingTime(node),
        },
      },
    });
  }
};
