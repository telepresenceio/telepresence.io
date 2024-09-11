const path = require('path');
const fs = require('fs');
const jsYAML = require('js-yaml');
const url = require('url');

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
      fallback: {
        fs: false,
      },
    },
  });
};

exports.onCreateNode = async ({ node, loadNodeContent, actions }) => {
  const docsConfig = require('./docs-config');

  if (node.internal.type === 'File' && node.sourceInstanceName === docsConfig.sourceInstanceName && node.ext === ".yml") {
    // Call loadNodeContent to force-populate node.internal.content, because
    // gatsby-source-filesystem is just a little too lazy about populating it,
    // because otherwise it doesn't get populated even though doc-page.js asks
    // for it.
    await loadNodeContent(node);
  }
};

// Tell Gatsby to create web pages for each of the docs markdown files.
exports.createPages = async ({ graphql, actions }) => {
  const docsConfig = require('./docs-config');

  // List all the markdown files...
  const result = await graphql(`
    query($sourceInstanceName: String!) {
      pageFiles: allFile(filter: {
        sourceInstanceName: { eq: $sourceInstanceName },
        base: { regex: "/^.*[.]md$/" },
      }) {
        edges {
          node {
            id
            relativePath
          }
        }
      }
      redirectFiles: allFile(filter: {
        sourceInstanceName: { eq: $sourceInstanceName },
        base: { eq: "redirects.yml" },
      }) {
        edges {
          node {
            relativePath
            internal {
              content
            }
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
  const basepath = path.posix.sep;

  // ...and finally generate HTML pages for them.
  let variablesCache = {};
  let sidebarCache = {};
  for (const { node } of result.data.pageFiles.edges) {

    const urlPath = docsConfig.urlpath(node);
    const nodePath = urlPath.replaceAll(path.posix.sep, path.sep)
    const variablesFilepath = docsConfig.variablesFilepath(node);
    if (!(variablesFilepath in variablesCache)) {
      const fp = path.join(docsConfig.sourceInstanceName, variablesFilepath)
      if (fs.existsSync(fp)) {
        variablesCache[variablesFilepath] = jsYAML.load(fs.readFileSync(fp));
      }
    }

    const sidebarFilepath = docsConfig.sidebarFilepath(node);
    if (!(sidebarFilepath in sidebarCache)) {
      const fp = path.join(docsConfig.sourceInstanceName, sidebarFilepath)
      if (fs.existsSync(fp)) {
        sidebarCache[sidebarFilepath] = jsYAML.load(fs.readFileSync(fp));
      }
    }

    actions.createPage({
      // URL-path to create the page at
      path: urlPath,
      // Absolute filepath of the component to render the page with
      component: path.resolve('./src/templates/doc-page.js'),
      // Arguments to pass to that component's `query`
      context: {
        contentFileNodeID:   node.id,
        variables: variablesCache[variablesFilepath],
        sidebar:   sidebarCache[sidebarFilepath],
        docinfo: {
          docrootURL:   docsConfig.docrootURL(node),
          canonicalURL: docsConfig.canonicalURL(node),
          githubURL:    docsConfig.githubURL(node),

          maybeShowReadingTime: docsConfig.maybeShowReadingTime(node),

          peerVersions: docsConfig.peerVersions(urlPath, allURLPaths),
        },
      },
    });

    const fp = path.join(nodePath, "redirects.yml")
    if (fs.existsSync(fp)) {
      const redirectFile = jsYAML.load(fs.readFileSync(fp))
      for (const {from, to} of redirectFile) {
        actions.createRedirect({
          fromPath: path.posix.normalize(url.resolve(basepath, from) + path.posix.sep),
          toPath: url.resolve(basepath, to),
        })
      }
    }
  }

  // This part makes me super uncomfortable, and I'm sure there's a better way
  // to do it that we should find.
  for (const { node } of result.data.staticFiles.edges) {
    const src = node.absolutePath;
    const dst = path.join('public', docsConfig.urlpath(node).replaceAll(path.posix.sep, path.sep));
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }

  // Side-wide redirects
  for (const { from, to } of jsYAML.load(fs.readFileSync('./redirects.yml'))) {
    actions.createRedirect({
      fromPath: url.resolve(basepath, from),
      toPath:   url.resolve(basepath, to),
    })
  }
};
