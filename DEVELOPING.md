# How to hack on this

## Releasing Docs for new Telepresence Versions

## Local development quickstart

Prerequisites programs:

 - `node` (v15 or newer)
 - `yarn` (v1.22.22)
 - `docusaurus` (3.5.2)

Commands of interest:

   ```shell
   # Prep
   yarn install             # Install dependencies in to ./node_modules/
   
   # Pull a docs version from a specific branch of the telepresence repository
   # and generate a new minor version of the docs (can be repeated after changes
   # on the designated branch).
   DOCS_BRANCH=release/v2.22 DOCS_VERSION=2.22 make generate-version

   # Development
   docusaurus start  # Serve a hot-reloading development-build at http://localhost:8000/

   # Production or production-like
   docusaurus build  # Build a production-build, writing it to ./public/
   docusaurus serve  # Serve ./public/ at http://localhost:9000/ (see below for commentary)

## Tour of the sources

Yarn:
 - `package.json` lists all of our dependencies.
 - `yarn.lock` pins down specific versions of those dependencies.
 - `.npmrc` is used in conjuction with the `engines` field in
   `package.json` to enforce the use of Yarn instead of NPM.

Docusaurus:
 - `docusaurus.config.ts` configures which plugins Docusaurus should use.  (It
   also contains some site metadata.)
 - `src/pages/**.ts` by default, Docusaurus creates web pages for `*.ts`
   files under `src/pages/`.  Of particular note is `404.tsx`, since
   `/404` is special in that `docusaurus serve` and Netlify expect to use
   that for the HTTP 404 pages.  This is where we put non-docs
   webpages.

Our stuff:
 - `DEVELOPING.md`: This file.
 - `versioned_docs/<version>/` contains versions of the docs/ at
   telepresenceio/telepresence.git.
 - `src/assets/` and `src/components/` contain reusable assets and
   React web components that are shared by all versions of the docs.

Other:
 - `.editorconfig`: We use EditorConfig to configure text editors to
   do the right thing; indent by the correct number of spaces, trim
   trailing whitespace, add trailing newlines, that sort of thing.
   Please ensure that your editor obeys EditorConfig, there are
   plugins for most editors https://editorconfig.org/
 - `.eslintrc.js`: Configures the ESLint linter, which we use.
 - `.github/workflows/*.yml`: CI/CD configuration, except for Netlify.
   Netlify builds and deploys the site from `master`, and also puts
   preview deploys on PRs; so the configuration here doesn't need to
   worry about that, and only needs to worry about quality-checks like
   linting and link-checking.
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
