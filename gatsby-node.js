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
  for (const { node } of result.data.allFile.edges) {
    // We have `node.relativePath` path relative to the `options.path` given in
    // to the gatsby-source-filesystem instance in `gatsby-config.js`; so
    // `./docs/v2.2/howtos/intercepts.md` has
    // `node.relativePath="v2.2/howtos/intercepts.md"`.
    //
    // We need to get from that relative filepath to the URL-path of the
    // resulting web page (with a trailing slash, since Gatsby is opinionated).
    const urlpath = 'docs/' + (node.relativePath.
                               replaceAll(path.sep, path.posix.sep).
                               replace(/\/index\.md$/, '/').
                               replace(/\.md$/, '/'));

    // Which YAML file (relative to `options.path`, same as above) contains the
    // variable definitions that we should use for expanding $variables$ in this
    // markdown file?  If the YAML file doesn't exist, no variables with be
    // expanded.
    const variablesFilepath = path.join(node.relativePath.split(path.sep)[0], 'versions.yml');

    // Load variablesFilepath.
    if (!(variablesFilepath in variablesCache)) {
      // Part of me thinks this is disgusting, and to just hit the filesystem
      // directly.  But really, if we keep this nice and hermetic it will save
      // us headaches down the road.
      let subResult = await graphql(`
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
        relativePath: variablesFilepath,
      });
      if (!subResult.data.file) {
        variablesCache[variablesFilepath] = {}
      } else {
        const yamlStr = await loadNodeContent(subResult.data.file);
        const yamlObj = await jsYaml.safeLoad(yamlStr);
        variablesCache[variablesFilepath] = yamlObj;
      }
    }

    // Actually generate the page.
    actions.createPage({
      // URL-path to create the page at
      path: urlpath,
      // Absolute filepath of the component to render the page with
      component: path.resolve('./src/templates/doc-page.js'),
      // Arguments to pass to that component's `query`
      context: {
        markdownFileNodeID: node.id,
        variables: variablesCache[variablesFilepath],
      },
    });
  }
};
