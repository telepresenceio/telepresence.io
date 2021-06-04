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
