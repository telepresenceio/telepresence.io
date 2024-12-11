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
	git fetch telepresence
	rm -rf docs
	git add docs || true
	git read-tree --prefix docs -u telepresence/$(DOCS_BRANCH):docs

# drop-version will remove the version given by DOCS_VERSION.
# Example:
# DOCS_VERSION=2.21 make drop-version
.PHONY: drop-version
drop-version:
	rm -rf "versioned_docs/version-$(DOCS_VERSION)"
	rm -rf "versioned_sidebars/version-$(DOCS_VERSION)-sidebars.json"
	jq '. - ["$(DOCS_VERSION)"]' versions.json > versions.tmp && mv versions.tmp versions.json

# generate-version will first remove the given version and then regenerate it. Assumes that
# read-branch has been called just prior.
.PHONY: generate-version
generate-version: drop-version
	yarn docusaurus docs:version $(DOCS_VERSION)
	rm -rf docs
	git checkout HEAD -- docs
	git add .
