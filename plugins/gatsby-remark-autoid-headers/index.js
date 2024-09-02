// gatsby-remark-autoid-headers does two things:
//
//  1. Implement the heading IDs piece of extendedn markdown syntax
//     https://www.markdownguide.org/extended-syntax/#heading-ids
//
//  2. If a heading does not manually specify an ID using that syntax,
//     then auto-generate an ID for it.
//
// The procedure it uses to auto-generate IDs is identical to
// gatsby-remark-autolink-headers's default behavior; we do *not*
// implement the 'maintainCase' or 'removeAccents' settings that
// gatsby-remark-autolink-headers has to change this behavior.
//
// This is heavily based on and borrows code from
// https://github.com/gatsbyjs/gatsby/blob/gatsby%402.24.2/packages/gatsby-remark-autolink-headers/src/index.js

const toString = require(`mdast-util-to-string`);
const visit = require(`unist-util-visit`);
const slugs = require(`github-slugger`)();

module.exports = ({ markdownAST, markdownNode }, pluginOptions) => {
  slugs.reset();
  const { fileAbsolutePath } = markdownNode;
  visit(markdownAST, `heading`, (node) => {
    // Determine what the ID is.
    let id;
    if (node.children.length > 0) {
      const last = node.children[node.children.length - 1];
      // This regex matches to preceding spaces and {#custom-id} at the end of a string.
      // Also, checks the text of node won't be empty after the removal of {#custom-id}.
      const match = /^(.*?)\s*\{#([\w-]+)}$/.exec(toString(last));
      if (match && (match[1] || node.children.length > 1)) {
        id = match[2];
        // Remove the custom ID from the original text.
        if (match[1]) {
          last.value = match[1];
        } else {
          node.children.pop();
        }
      }
    }
    if (!id) {
      // Auto-generate an ID.
      id = slugs.slug(toString(node), false);
    }

    // Record that ID.
    if (!node.data) {
      node.data = {};
    }
    if (!node.data.hProperties) {
      node.data.hProperties = {};
    }
    if (id.includes('productname')) {
      const regex = /\/docs\/([^/]*)\//;
      const fullPath = fileAbsolutePath;
      const match = regex.exec(fullPath);
      if (match[1] === 'emissary') {
        id = id.replace(
          'productname',
          'emissary-ingress',
        );
      }
      if (match[1] === 'edge-stack') {
        id = id.replace(
          'productname',
          'ambassador-edge-stack',
        );
      }
      node.data.id = node.data.hProperties.id = id;
    }
    node.data.id = node.data.hProperties.id = id;
  });

  return markdownAST;
};
