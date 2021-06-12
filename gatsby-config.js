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
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-autolink-headers',
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
        ],
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
      // gatsby-plugin-netlify is a bummer because it doesn't work with `gatsby
      // serve` and the `netlify` CLI's server is pretty wildly different than
      // Netlify's actual server :( But to get redirects working well, we do
      // need integration with the server, and we do host on Netlify...
      resolve: `gatsby-plugin-netlify`,
      // There are a lot of "pros" to gatsby-plugin-meta-redirect, but it
      // removes URL fragments when following the redirect, which is a
      // show-stopper because the Telepresence 1 CLI prints out URLs with
      // fragments.
      //
      //resolve: 'gatsby-plugin-meta-redirect',
    },
  ],
};
