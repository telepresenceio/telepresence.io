# Ensure that the telepresence remote is up-to-date.
telepresence-remote:
	@if [ "$$(git remote | grep -E '^telepresence$$')" = 'telepresence' ]; then\
		git remote update telepresence;\
	else\
		git remote add -f telepresence git@github.com:telepresenceio/telepresence.git;\
	fi
.PHONY: telepresence-remote

# MATCH_TAGS is the regexp matching the tags that we expect will have docs.
MATCH_TAGS ?= ^v2\.[2-9][0-9]+\.[0-9]+$$

# EXCLUDE_TAGS is used when we want to exclude some of the matching tags from the telepresence repository
EXCLUDE_TAGS ?=

# Sort tags in descending order. We want the highest version to win in case there are multiple tags with
# the same major.minor combo. The versioned directory contains only the major.minor, and first matching tag wins.
tags := $(shell git tag -l | grep -E '$(MATCH_TAGS)' | (test -n '$(EXCLUDE_TAGS)' && grep -vE '$(EXCLUDE_TAGS)' || cat) | sed '/-/!{s/$$/_/}' | sort -rV | sed 's/_$$//')

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
