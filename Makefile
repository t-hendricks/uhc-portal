#
# Copyright (c) 2018 Red Hat, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# Binaries to build:
binaries:=$(shell ls cmd)

# Default target
.PHONY: setup
setup: binaries node_modules insights-proxy-check

# These are declared phony so `make binaries` always rebuilds them:
.PHONY: binaries
binaries:
	for binary in $(binaries); do \
		go build -o "$${binary}" "./cmd/$${binary}" || exit 1; \
	done

.PHONY: lint
lint: node_modules
	yarn lint
	golangci-lint \
		run \
		--no-config \
		--issues-exit-code=1 \
		--deadline=15m \
		--disable-all \
		--enable=deadcode \
		--enable=gas \
		--enable=goconst \
		--enable=gocyclo \
		--enable=gofmt \
		--enable=golint \
		--enable=ineffassign \
		--enable=interfacer \
		--enable=lll \
		--enable=maligned \
		--enable=megacheck \
		--enable=misspell \
		--enable=structcheck \
		--enable=unconvert \
		--enable=varcheck \
		$(NULL)

.PHONY: fmt
fmt:
	gofmt -s -l -w ./cmd/ ./pkg/.

.PHONY: test
test: node_modules
	yarn test

.PHONY: node_modules
node_modules:
	yarn install

.PHONY: app
app: node_modules
	yarn build --mode=production

# Marking git clones .PHONY so we can git pull even if they already exist.

.PHONY: run/insights-proxy
run/insights-proxy:
	[ -e $@ ] || git clone https://github.com/RedHatInsights/insights-proxy --depth=1 $@
	(cd $@; git pull)

# Patching /etc/hosts is needed (once) for using insights-proxy with local browser;
# NOT needed for selenium tests where we arrange it in the container running the browser.
.PHONY: insights-proxy-check
.SILENT: insights-proxy-check
insights-proxy-check: run/insights-proxy
	if ! grep --with-filename qa.foo.redhat.com /etc/hosts; \
	then \
		echo "ERROR: Need aliases in /etc/hosts to access the UI."; \
		echo "       To add them run: make insights-proxy-setup"; \
		exit 1; \
	fi

.PHONY: insights-proxy-setup
insights-proxy-setup: run/insights-proxy
	sudo bash -x run/insights-proxy/scripts/patch-etc-hosts.sh
	bash run/insights-proxy/scripts/update.sh

.PHONY: run/verification-tests
run/verification-tests:
	[ -e $@ ] || git clone --origin=xueli181114 https://github.com/xueli181114/verification-tests $@
	(cd $@; git remote | grep --quiet xueli181114 || git remote add xueli181114 https://github.com/xueli181114/verification-tests)
	(cd $@; git remote | grep --quiet openshift || git remote add openshift https://github.com/openshift/verification-tests)
	(cd $@; git fetch --all)
	(cd $@; git checkout -B patched xueli181114/new-cases)
	# Include https://github.com/openshift/verification-tests/pull/807
	(cd $@; git fetch openshift pull/807/head; git merge --no-edit FETCH_HEAD)
	# Symlink for running tests without container to match mount made with container.
	ln --symbolic --no-target-directory ../private run/verification-tests/private

run/cucushift:
	# Private repo, https://github.com/orgs/openshift/teams/team-red-hat needed to clone.
	[ -e $@ ] || git clone ssh://git@github.com/xueli181114/cucushift.git --depth=1 $@
	(cd $@; git remote | grep --quiet xueli181114 || git remote add xueli181114 ssh://git@github.com/xueli181114/cucushift.git)
	(cd $@; git remote | grep --quiet openshift || git remote add openshift ssh://git@github.com/openshift/cucushift.git)
	(cd $@; git fetch --all; git checkout xueli181114/new-cases)

.PHONY: selenium-tests-image
selenium-tests-image: run/verification-tests run/cucushift
	run/podman-or-docker.sh build --tag=ocm-selenium-tests --file=run/Dockerfile.selenium-tests run/

.PHONY: clean
clean:
	rm -rf \
		$(binaries) \
		build \
		node_modules \
		run/cucushift \
		run/insights-proxy \
		run/verification-tests \
		$(NULL)
