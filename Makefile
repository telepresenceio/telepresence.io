define nl


endef

subtree-preflight:
	@if ! grep -q -e 'has_been_added' $$(PATH=$$(git --exec-path):$$PATH which git-subtree 2>/dev/null) /dev/null; then \
	    printf '$(RED)Please upgrade your git-subtree:$(END)\n'; \
	    printf '$(BLD)  sudo curl -fL https://raw.githubusercontent.com/LukeShu/git/lukeshu/next/2021-05-15/contrib/subtree/git-subtree.sh -o $$(git --exec-path)/git-subtree && sudo chmod 755 $$(git --exec-path)/git-subtree$(END)\n'; \
	    false; \
	else \
	    printf '$(GRN)git-subtree OK$(END)\n'; \
	fi
	git gc
.PHONY: subtree-preflight

pull-docs: ## Update ./docs from https://github.com/datawire/ambassador-docs
pull-docs: subtree-preflight
	git subtree pull --squash --prefix=docs/pre-release https://github.com/datawire/ambassador-docs products/telepresence/master
	$(foreach subdir,$(shell find docs -mindepth 1 -maxdepth 1 -type d -name 'v*' -not -name v1),\
          git subtree pull --squash --prefix=$(subdir) https://github.com/datawire/ambassador-docs $(patsubst docs/%,products/telepresence/%,$(subdir))$(nl))
.PHONY: pull-docs

PUSH_BRANCH ?= $(USER)/from-telepresence.io-$(shell date +%Y-%m-%d)
push-docs: ## Publish ./ambassador to https://github.com/datawire/ambassador-docs
push-docs: subtree-preflight
	@PS4=; set -x; { \
	  git remote add --no-tags remote-adocs https://github.com/datawire/ambassador-docs && \
	  git remote set-url --push remote-adocs git@github.com:datawire/ambassador-docs && \
	  git remote set-branches remote-adocs 'products/telepresence/*' && \
	:; } || true
	git fetch --prune remote-adocs
	$(foreach subdir,$(shell find docs -mindepth 1 -maxdepth 1 -type d),\
          git subtree push --rejoin --squash --prefix=$(subdir) remote-adocs $(patsubst docs/%,$(PUSH_BRANCH)/products/telepresence/%,$(subdir))$(nl))
.PHONY: push-docs
