# Ensure that the telepresence remote is up-to-date.
telepresence-remote:
	@if [ "$$(git remote | grep -E '^telepresence$$')" = 'telepresence' ]; then\
		git remote update telepresence;\
	else\
		git remote add -f telepresence git@github.com:telepresenceio/telepresence.git;\
	fi
.PHONY: telepresence-remote

# MATCH_TAGS is the regexp matching the tags that we expect will have docs.
MATCH_TAGS ?= ^v2\.[2-9][0-9]+\.[0-9]+(-rc\.[0-9]+)?$$

# EXCLUDE_TAGS is used when we want to exclude some of the matching tags from the telepresence repository
EXCLUDE_TAGS ?=

# Sort tags in descending order. We want the highest version to win in case there are multiple tags with
# the same major.minor combo. The versioned directory contains only the major.minor, and first matching tag wins.
tags := $(shell git tag -l | grep -E '$(MATCH_TAGS)' | (test -n '$(EXCLUDE_TAGS)' && grep -vE '$(EXCLUDE_TAGS)' || cat) | sed '/-/!{s/$$/_/}' | sort -rV | sed 's/_$$//')

.PHONY: echo-tags
echo-tags:
	echo $(tags)

.PHONY: pull-docs
pull-docs: telepresence-remote
	set -x -e
	for release in $(tags); do \
	  	echo $$release;\
		version=$$(expr "$$release" : 'v\([0-9]\.[0-9][0-9]*\)');\
		test -d "versioned_docs/version-$$version" || { \
			rm -rf docs ;\
			git add docs || true;\
			git read-tree --prefix docs -u $$release:docs &&\
			yarn docusaurus docs:version $$version ;\
		};\
	done
	git add .
	rm -rf docs
	git checkout HEAD -- docs

DOCS_VERSION:=${DOCS_VERSION}
DOCS_BRANCH:=${DOCS_BRANCH}

.PHONY: read-branch
read-branch:
	git remote add telepresence git@github.com:telepresenceio/telepresence.git
	git fetch --no-tags telepresence
	rm -rf docs
	git add docs || true
	git read-tree --prefix docs -u telepresence/$(DOCS_BRANCH):docs
	git remote remove telepresence

# TELEPRESENCE_REPO is the local clone of telepresenceio/telepresence that the
# -local targets read from.
TELEPRESENCE_REPO ?= ../telepresence

# read-branch-local is like read-branch, but reads DOCS_BRANCH directly from
# the local clone at TELEPRESENCE_REPO, so unpushed branches can be previewed.
# Example:
# DOCS_BRANCH=thallgren/docs-restructure make read-branch-local
.PHONY: read-branch-local
read-branch-local:
	git fetch --no-tags $(TELEPRESENCE_REPO) $(DOCS_BRANCH)
	rm -rf docs
	git add docs || true
	git read-tree --prefix docs -u FETCH_HEAD:docs

# drop-version will remove the version given by DOCS_VERSION.
# Example:
# DOCS_VERSION=2.21 make drop-version
.PHONY: drop-version
drop-version:
	rm -rf "versioned_docs/version-$(DOCS_VERSION)"
	rm -rf "versioned_sidebars/version-$(DOCS_VERSION)-sidebars.json"
	jq '. - ["$(DOCS_VERSION)"]' versions.json > versions.tmp && mv versions.tmp versions.json

# generate-redirects regenerates the marked section of static/_redirects from
# the redirects.yml files in the versioned docs. Hand-maintained rules outside
# the markers are left untouched.
.PHONY: generate-redirects
generate-redirects:
	node scripts/generate-redirects.mjs

# MAX_VERSIONS is the number of docs versions the site retains. When a new
# minor version surfaces through generate-version, versions further back are
# scrubbed by prune-versions.
MAX_VERSIONS ?= 5

# prune-versions scrubs docs versions beyond the MAX_VERSIONS newest ones:
# their versioned_docs tree, sidebar file, and versions.json entry. Blog posts
# with links pinned to a scrubbed version must be repointed to a surviving
# one; the docusaurus build fails on the broken links otherwise.
.PHONY: prune-versions
prune-versions:
	node scripts/prune-versions.mjs $(MAX_VERSIONS)

# generate-version will first remove the given version and then regenerate it. Assumes that
# read-branch has been called just prior.
.PHONY: generate-version
generate-version: read-branch drop-version
	yarn docusaurus docs:version $(DOCS_VERSION)
	rm -rf docs
	git checkout HEAD -- docs
	$(MAKE) prune-versions
	$(MAKE) generate-redirects
	git add .

# generate-version-local is like generate-version, but reads DOCS_BRANCH from
# the local clone at TELEPRESENCE_REPO. Example:
# DOCS_BRANCH=thallgren/docs-restructure DOCS_VERSION=2.30 make generate-version-local
.PHONY: generate-version-local
generate-version-local: read-branch-local drop-version
	yarn docusaurus docs:version $(DOCS_VERSION)
	rm -rf docs
	git checkout HEAD -- docs
	$(MAKE) prune-versions
	$(MAKE) generate-redirects
	git add .
