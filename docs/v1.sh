#!/bin/bash

git mv macros.html    macros.js
git mv SUMMARY.md     doc-links.yml
git mv redirects.json redirects.yml


git mv \
    case-studies/ \
    ../../src/pages/
git mv \
    about.html \
    announcing-telepresence-2.html \
    community.html \
    index.html \
    related-projects.md \
    ../../src/pages/

git mv \
    images/ \
    ../../src/assets/

mkdir ../../static
git mv \
    favicon.ico \
    \
    ../../static

git rm -rf \
    js/ \
    internal/ \
    _layouts/ \
    styles/
git rm -f \
    .bookignore \
    .gitignore \
    INDEX.md \
    README.md \
    USERS.md \
    book.json.in \
    build-website.py \
    build-website.sh \
    googlec93178192ed238ff.html \
    package-lock.json \
    package.json
