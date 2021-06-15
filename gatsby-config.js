// Many packages in the build process have built-in sanity checking; we want CI
// to be able to run those checks to catch mistakes.
//
// Many of these packages, such as 'react-dom' and 'gatsby-link' only do that
// sanity checking in NODE_ENV == 'development', or at least NODE_ENV !=
// 'production'.  This is problematic because `gatsby build` forcefully sets
// NODE_ENV='production', and ignores whatever the user actually set NODE_ENV
// to.  And `gatsby develop` doesn't help, because it won't eagerly process
// every page (and even if it did, a lot of the errors would end up in the
// browser console when you go to that page, and not in the terminal).
//
// So, give the user an escape hatch to undo what `gatsby build` did.
process.env.NODE_ENV = process.env.OVERRIDE_NODE_ENV || process.env.NODE_ENV;

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
    // We need this in order to set things in <head> in the HTML.  Otherwise it
    // gets set by client-side in the DOM after page-load.
    {
      resolve: 'gatsby-plugin-react-helmet',
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
    // Dump the GraphQL schema so that ESLint can take advantage of that info.
    {
      resolve: 'gatsby-plugin-extract-schema',
    },
  ],
};
