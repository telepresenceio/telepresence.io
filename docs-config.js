const path = require('path');
const semver = require('semver');

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
    return '/docs/' + (node.relativePath
                       .replaceAll(path.sep, path.posix.sep)
                       .replace(/\/index\.md$/, '/')
                       .replace(/\.md$/, '/')
                       .replace(/releaseNotes\.yml$/, 'release-notes/'));
  },

  docrootURL: function(node) {
    return `/docs/${node.relativePath.split(path.sep)[0]}/`;
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
    const version = urlpath.split(path.posix.sep)[2];
    if (version === "v1") {
      // v1 docs aren't on getambassador.io
      return urlpath;
    }
    const relpath = urlpath.split(path.posix.sep).slice(3).join(path.posix.sep);
    return `https://www.getambassador.io/docs/telepresence/latest/${relpath}`;
  },

  githubURL: function(node) {
    const gitpath = 'docs/' + (node.relativePath
                               .replace(/^latest/,'v2.5')
                               .replaceAll(path.sep, path.posix.sep));
    return `https://github.com/telepresenceio/telepresence.io/blob/master/${gitpath}`;
  },

  // Don't show reading time for Telepresence.
  maybeShowReadingTime: function(node) {
    return false;
  },

  // Given an URL path, and a Set of all docs URL paths, return an Array of
  // [$version, $urlpath] pairs where $urlpath is where the user should be taken
  // to view "this page, but for $version"; using a falsey value to indicate
  // "don't go anywhere (i.e. you are already on $version)".
  peerVersions: function(thisURLPath, allURLPaths) {
    const getVersion = (urlpath) => {
      const slug = urlpath.split(path.posix.sep)[2];
      let human = slug
      if (slug.startsWith("v")) {
        human = slug.slice(1);
      } else if (slug === "latest") {
        human = "Latest";
      } else if (slug === "pre-release") {
        human = "Pre-release";
      }
      return { slug, human };
    };
    const sortVersions = (versions) => {
      return [...versions].sort((a, b) => {
        // Return the sign of `a - b`
        const aSem = semver.valid(semver.coerce(a));
        const bSem = semver.valid(semver.coerce(b));
        if (aSem && bSem) {
          return semver.compare(aSem, bSem);
        } else {
          // One of them isn't a number.  JS string lt/gt is based on byte-wise
          // comparison when encoded as UTF-16.  That happens to do what we want
          // with "Pre-Release", "Latest", and values that start with a digit.
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    };

    const thisSuffix = thisURLPath.split(path.posix.sep).slice(3).join(path.posix.sep);
    const thisVersion = getVersion(thisURLPath);

    let peers = {};
    peers[thisVersion.human] = null;
    // This page in other versions.
    for (const otherURLPath of allURLPaths) {
      const otherSuffix = otherURLPath.split(path.posix.sep).slice(3).join(path.posix.sep);
	    const otherVersion = getVersion(otherURLPath);
      if (otherURLPath !== thisURLPath && otherSuffix === thisSuffix) {
        peers[otherVersion.human] = otherURLPath;
      }
    }
    // Some versions might not have this page, for those versions, go to the
    // version's home page.
    for (const otherURLPath of allURLPaths) {
	    const otherVersion = getVersion(otherURLPath);
      if (!(otherVersion.human in peers)) {
        peers[otherVersion.human] = `/docs/${otherVersion.slug}/`;
      }
    }

    // Sort the results
    let sortedVersions = sortVersions(Object.keys(peers)).map((version) => ([version, peers[version]]));

    // Mark versions older than v2.4.0 as deprecated
    var updateDeprecated = function(element){
        const version = semver.coerce(element[0]);
        const isSem = semver.valid(version);
        if (isSem && semver.lt(version, "2.5.0")) {
            element[0] = element[0] + " (deprecated)"
        }
        return element
    };
    let ret = sortedVersions.map(updateDeprecated)
    return ret;
  },

};
