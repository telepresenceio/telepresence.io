# Ensure that the telepresence remote is up-to-date.
telepresence-remote:
	@if [ "$$(git remote | grep -E '^telepresence$$')" = 'telepresence' ]; then\
		git remote update telepresence;\
	else\
		git remote add -f telepresence git@github.com:telepresenceio/telepresence.git;\
	fi
.PHONY: telepresence-remote

# MATCH_TAGS is the regexp matching the tags that we expect will have docs.
MATCH_TAGS ?= ^v2\.[2-9][0-9]+\.[0-9]+(-(rc|test)\.[0-9]+)$$

# EXCLUDE_TAGS is used when we want to exclude some of the matching tags from the telepresence repository
EXCLUDE_TAGS ?=

# Update the docs at docs/v<major>.<minor> from the found tags.
pull-docs:
	$(foreach release,$(shell git tag -l | grep -E '$(MATCH_TAGS)' | (test -n '$(EXCLUDE_TAGS)' && grep -vE '$(EXCLUDE_TAGS)' || cat) | sort -V),\
		dir=$$(expr '$(release)' : '\(v[0-9]\.[0-9][0-9]*\)');\
		echo $$dir;\
		rm -rf docs/$$dir;\
		git add docs;\
		git read-tree --prefix docs/$$dir -u $(release):docs)
.PHONY: pull-docs
