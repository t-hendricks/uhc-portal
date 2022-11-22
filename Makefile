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
lint: js-lint go-lint

.PHONY: js-lint
js-lint: node_modules
	yarn lint

.PHONY: go-lint
go-lint:
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
		--enable=lll \
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
	yarn build --mode=production --env api-env=staging

# Marking git clones .PHONY so we can git pull even if they already exist.

.PHONY: run/insights-proxy
run/insights-proxy:
	[ -e $@ ] || git clone https://github.com/RedHatInsights/insights-proxy --depth=1 $@

.PHONY: run/ocm-api-model
run/ocm-api-model:
	[ -e $@ ] || git clone https://github.com/openshift-online/ocm-api-model --depth=1 $@
	(cd $@; git pull)

.PHONY: run/ocm-api-metamodel
run/ocm-api-metamodel:
	[ -e $@ ] || git clone https://github.com/openshift-online/ocm-api-metamodel --depth=1 $@
	(cd $@; git pull)

.PHONY: openapi
openapi: run/ocm-api-model run/ocm-api-metamodel
	# Download those we use. See openapi/README.md.
	curl https://api.stage.openshift.com/api/accounts_mgmt/v1/openapi | jq . > openapi/accounts_mgmt.v1.json 
	curl https://api.stage.openshift.com/api/authorizations/v1/openapi | jq . > openapi/authorizations.v1.json 
	curl https://api.stage.openshift.com/api/service_logs/v1/openapi | jq . > openapi/service_logs.v1.json 
	curl https://api.stage.openshift.com/api/upgrades_info/v1/openapi | jq . > openapi/upgrades_info.v1.json 
	curl https://console.redhat.com/api/insights-results-aggregator/v1/openapi.json | jq . > openapi/insights-results-aggregator.v1.json
	curl https://console.redhat.com/api/insights-results-aggregator/v2/openapi.json | jq . > openapi/insights-results-aggregator.v2.json
	curl https://console.redhat.com/api/cost-management/v1/openapi.json | jq . > openapi/cost-management.v1.json

	# This one will be overwritten, below (if successful).
	curl https://api.stage.openshift.com/api/clusters_mgmt/v1/openapi | jq . > openapi/clusters_mgmt.v1.json

	# Get fresher specs for clusters-service. See openapi/README.md.
	(cd run/ocm-api-metamodel; make)
	run/ocm-api-metamodel/metamodel generate openapi --model=run/ocm-api-model/model --output=run/ocm-api-model/openapi
	cat run/ocm-api-model/openapi/clusters_mgmt/v1/openapi.json | jq . > openapi/clusters_mgmt.v1.json

# Patching /etc/hosts is needed (once) for using insights-proxy with local browser;
# NOT needed for selenium tests where we arrange it in the container running the browser.
.PHONY: insights-proxy-check
.SILENT: insights-proxy-check
insights-proxy-check: run/insights-proxy
	if ! grep --with-filename qa.foo.redhat.com /etc/hosts \
        || ! grep --with-filename prod.foo.redhat.com /etc/hosts; \
	then \
		echo "ERROR: Need aliases in /etc/hosts to access the UI."; \
		echo "       To add them run: make dev-env-setup"; \
		exit 1; \
	fi

.PHONY: dev-env-setup
dev-env-setup: run/insights-proxy
	sudo bash -x run/insights-proxy/scripts/patch-etc-hosts.sh

.PHONY: insights-proxy-setup
insights-proxy-setup: dev-env-setup
	run/podman-or-docker.sh pull quay.io/redhat-sd-devel/insights-proxy:3.2.1

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
