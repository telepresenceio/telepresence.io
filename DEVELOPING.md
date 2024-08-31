# How to hack on this

## Releasing Docs for new Telepresence Versions

## Local development quickstart

Prerequisites programs:

 - `node` (v15 or newer)
 - `yarn` (v1.3.2 or newer v1.X)

Commands of interest:

   ```shell
   # Prep
   yarn install             # Install dependencies in to ./node_modules/

   # Development
   export NODE_OPTIONS=--openssl-legacy-provider
   yarn run gatsby develop  # Serve a hot-reloading development-build at http://localhost:8000/
   yarn run gatsby repl     # Run a Node.js REPL in the Gatsby environment
   yarn run eslint .        # Run the linter
   make pull-docs           # Update ./docs/ from telepresenceio/telepresence.git

   # Production or production-like
   yarn run gatsby build    # Build a production-build, writing it to ./public/
   ./bin/serve.js           # Serve ./public/ at http://localhost:9000/ (see below for commentary)

   # Other
   yarn run gatsby clean    # Clean ./.cache/, which sometimes becomes corrupt
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
 - `src/templates/` contains the HTML templates for generating pages
   from various sources (namely `doc-page.js` for generating pages
   from the docs markdown).

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

## Why use a home-grown `./bin/serve.js` script?

Why not use `yarn run gatsby serve` or `netlify dev`?

One word: redirects.  `gatsby serve` doesn't obey `_redirects`, and we
rely on those redirects. `netlify dev`'s behavior regarding trailing
slashes is sufficiently different than the actual Netlify behavior
that IMO it's worthless.

`./bin/serve.js` is a minimal server that supports just the features
we care about in a web server:
 - Setting `Content-Type`
 - Serving the files
 - Netlify-like handling of trailing `/` and trailing `.html`
 - Handling of `_redirects`

It doesn't support range requests or different request methods or
caching or Content-Length or security headers.  It's good enough for a
broken-link-checker and for local dev.  And that's it.

## Don't use doc-version specific web components

It's tempting to plop `MyComponent.js` files in the
`docs/VERSION/whatever/` directories, and then write `import
./MyComponent` in your `.md` file in order to use it.  But it's my
recommendation that we stop doing that, and here's why:

It turns out that "gatsby-plugin-mdx" has a long-standing issues
regarding its handling of imports
(https://github.com/gatsbyjs/gatsby/issues/17119 , closed in favor of
https://github.com/gatsbyjs/gatsby/discussions/25069 .  Known August
2019, with no progress since July 2020), and that all imports are
"global".  What I mean by that putting an `import` in one `.md` file
imports that thing in to *all* `.md` files.

At first this seems like not such a big deal; so what if there are
extra things imported that you don't use?  But it is a big deal
because it means that two imports can't have the same name; one will
overwrite the other (which one wins depends on the filesystem-order of
files in Gatsby's `.cache/` directory, and so isn't even stable from
one computer to another!).

Mostly this isn't such a big deal, since if you choose good names and
reuse components then names are fairly unlikely to clash.  However,
it's pretty much a deal-breaker for components that get versioned
alongside the docs, as the multiple versions of the component will
have the same import-name, and so one version will win, and all
versions of the docs will end up sharing that one version, and which
version that is is essentially random.

Now, it's *almost* possible to work around this by passing the
`scope=` property to `<MDXRenderer>`.  However, the blocker to that is
getting the value to pass to that property.  The value needs to be a
dict of all the objects that the rendered file `import`s.  It would be
easy for gatsby-plugin-mdx to expose that information to us, but it
doesn't.  The jerks.  Maybe one of us should send them a patch.

So, what should you do instead?  Good question.  I guess try to factor
out generalizable pieces in to `src/components/` so that you don't
need per-product-version JS?  Because having per-product-version JS
simply doesn't work: One of the versions overwrites the other
versions.

## Future work

### Use `lessBabel`

Gatsby 1.27 / gatsby-plugin-mdx 1.5.0 (both newer than what we
currently use) introduced the `lessBabel` option for
gatsby-plugin-mdx.  They claim it speeds up MDX builds by 40%.  It
isn't the default because it breaks users who need Babel to process
their markdown, but we don't do that, so it should be safe for us to
turn it on.

So we should upgrade Gatsby and associated plugins, and then turn
`lessBabel` on.

### Factor out the docs build

The docs-build machinery in of `package.json`, `gatsby-config.js`,
`gatsby-node.js`, `src/assets/` and `src/components/` seem obviously
want to be a separate reusable module, so that these things don't need to
be manually kept in-sync between telepresence.io,  and telepresence.
This seems to be mostly obvious an trival to  do... except for I can't
figure how to handle `src/templates/doc-page.js` to where it's sufficiently
parametarized/pluggable, or a way to make it possible to plug in the
site-specific one.

Just wrap the whole thing up in to a Gatsby plugin (share it either as
a real NPM/Yarn package, or vendor it in as a subtree?), and give it
several settings in `gatsby-config.js`:
 - A unique instance name (to pass along to gatsby-source-filesystem)
 - A directory to look for docs in (to pass along to
   gatsby-source-filesystem)
 - A function to map from `node.relativePath` to URL path (to handle
   things being nested/placed differently in different sites)
 - A function to map from `node.relativePath` to which variables YAML
   file to use (likewise).

But I don't know what to do about `doc-page.js`.  Why not just include
a `component` filepath, to pass along verbatim to
`actions.createPage`?  Because it turns out that the contents of the
file pointed to are pretty tightly coupled to all the rest of it.  I
guess having to keep one file in-sync manually is better than having
to keep everything in-sync manually.
