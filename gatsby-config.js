module.exports = {
  siteMetadata: {
    title: "Telepresence",
    siteURL: "https://www.telepresence.io"
  },
  plugins: [

    // We have a bunch of documentation subtree'd in at ./docs/
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: `${__dirname}/docs/`,
      },
    },
    // Plugins adding support for additional filetypes in ./docs/
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.md`],
      },
    },
    {
      resolve: 'gatsby-plugin-less',
    },
    // Plugins adding support for additional filetypes in ./src/assets/
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/,
        },
      },
    },
    // We have some fancy page metadata
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'frontmatter-schema',
        path: `${__dirname}/src/frontmatter-schema/`,
      },
    },
    {
      resolve: 'gatsby-remark-reading-time',
    },

    // Gatsby actions.createRedirect does nothing by default; it needs a
    // server-specific backend to actually work.
    {
      // I'm choosing gatsby-plugin-meta-dredirect over gatsby-plugin-netlify
      // because TBH Netlify is just a little too magical for my taste and I
      // need to be able to confidently reason about this.
      resolve: 'gatsby-plugin-meta-redirect',
      //resolve: `gatsby-plugin-netlify`,
    },
  ],
};
