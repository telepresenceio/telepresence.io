const path = require('path');

module.exports = {
  // The gatsby-source-filesystem's options.name from gatsby-config.js
  sourceInstanceName: "docs",

  // We have `node.relativePath` path relative to the `options.path` given in to
  // the gatsby-source-filesystem instance in `gatsby-config.js`; so
  // `./docs/v2.2/howtos/intercepts.md` has
  // `node.relativePath="v2.2/howtos/intercepts.md"`.
  //
  // We need to get from that relative filepath to the URL-path of the resulting
  // web page (with a trailing slash, since Gatsby is opinionated).
  urlpath: function(node) {
    return 'docs/' + (node.relativePath.
                      replaceAll(path.sep, path.posix.sep).
                      replace(/\/index\.md$/, '/').
                      replace(/\.md$/, '/'));
  },

  docrootURL: function(node) {
    return `/docs/${this.version(node)}/`;
  },

  // Which YAML file (relative to `options.path`, same as above) contains the
  // variable definitions that we should use for expanding $variables$ in this
  // markdown file?  If the YAML file doesn't exist, no variables with be
  // expanded.
  variablesFilepath: function(node) {
    return path.join(node.relativePath.split(path.sep)[0], 'versions.yml');
  },

  // Which YAML file (relative to `options.path`, same as above) contains the
  // links for the sidebar that we should use when rendering this markdown
  // file's page? for expanding $variables$ in this markdown file?
  sidebarFilepath: function(node) {
    return path.join(node.relativePath.split(path.sep)[0], 'doc-links.yml');
  },

  canonicalURL: function(node) {
    const urlpath = this.urlpath(node);
    const relpath = urlpath.split(path.posix.sep).slice(2).join(path.posix.sep);
    return `https://www.getambassador.io/docs/telepresence/latest/${relpath}`;
  },

  githubURL: function(node) {
    let versionPart = node.relativePath.split(path.sep)[0];
    if (versionPart === 'pre-release') {
      versionPart = 'master';
    }
    const branch = `products/telepresence/${versionPart}`;
    const filePart = node.relativePath.split(path.sep).slice(1).join(path.posix.sep);
    return `https://github.com/datawire/ambassador-docs/blob/${branch}/${filePart}`;
  },

  version: function(node) {
    return node.relativePath.split(path.sep)[0];
  },

  // Don't show reading time for Telepresence.
  maybeShowReadingTime: function(node) {
    return false;
  }
};
