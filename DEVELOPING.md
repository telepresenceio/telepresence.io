# How to hack on this

## Local development quickstart

Prerequisites programs:

 - `node` (v12 or newer?)
 - `yarn` (v1.3.2 or newer v1.X)

Commands of interest:

   ```shell
   # Prep
   yarn install             # Install dependencies in to ./node_modules/

   # Development
   yarn run gatsby develop  # Serve a hot-reloading development-build at http://localhost:8000/
   yarn run gatsby repl     # Run a Node.js REPL in the Gatsby environment.

   # Production or production-like
   yarn run gatsby build    # Build a production-build, writing it to ./public/
   yarn run gatsby serve    # Serve ./public/ at http://localhost:9000/
   ```

You may wish to say `PATH=$PWD/node_modules/.bin:$PATH` instead of
prefixing commands with `yarn run`.

## Tour of the sources

Yarn:
 - `package.json` lists all of our dependencies.
 - `yarn.lock` pins down specific versions of those dependencies.
 - `.npmrc` is used in conjuction with the `engines` field in
   `package.json` to enforce the use of Yarn instead of NPM.

Gatsby:
 - `gatsby-config.js` configures which plugins Gatsby should use.  (It
   also contains some site metadata.)
 - `gatsby-node.js` is the "main" Gatsby configuration.
 - `src/pages/**.js` by default, Gatsby creates web pages for `*.js`
   files under `src/pages/`.  Of particular note is `404.js`, since
   `/404` is special in that `gatsby serve` and Netlify expect to use
   that for the HTTP 404 pages.  This is where we put non-docs
   webpages.

Our stuff:
 - `DEVELOPING.md`: This file.
 - `docs/` contains subtrees of ambassador-docs.git.
 - `src/assets/` and `src/components/` contain reusable assets and
   React web components that are shared by all versions of the docs.
   When referring to these from in a docs file, use the `@src` alias,
   rather than typing out a long series of `../../../../src`.

Other:
 - `.editorconfig`: We use EditorConfig to configure text editors to
   do the right thing; indent by the correct number of spaces, trim
   trailing whitespace, add trailing newlines, that sort of thing.
   Please ensure that your editor obeys EditorConfig, there are
   plugins for most editors https://editorconfig.org/
 - `.gitignore`: Duh.

## Yarn, not NPM

We use Yarn, not NPM.  Forgetting and accidentally using `npm` instead
of `yarn` is bad because it is reasonably likely that you'll end up
with a weirdly broken build, or that you'll accidentally commit
`package-lock.json`.  So, to help prevent that, `package.json` in
conjuction with `.npmrc` have been configured to have `npm install`
spit out an error if you try to run it:

   ```console
   $ npm install
   npm ERR! code EBADENGINE
   npm ERR! engine Unsupported engine
   npm ERR! engine Not compatible with your version of node/npm: undefined
   npm ERR! notsup Not compatible with your version of node/npm: undefined
   npm ERR! notsup Required: {"npm":"Please use yarn instead of npm","yarn":"^v1.3.2"}
   npm ERR! notsup Actual:   {"npm":"7.14.0","node":"v16.2.0"}

   npm ERR! A complete log of this run can be found in:
   npm ERR!     /home/lukeshu/.npm/_logs/2021-04-05T19_53_06_846Z-debug.log
   ```
