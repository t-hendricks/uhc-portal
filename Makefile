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

# binaries to build (currently only backend)
binaries:=$(shell ls cmd)

.PHONY: \
	app \
	binary \
	$(binaries) \
	clean \
	fmt \
	lint \
	node_modules \
	$(NULL)

binary: $(binaries)

# These are declared phony so `make backend` or `make binary` always rebuilds them.
# (there is no easy way to list all .go prerequisites)
$(binaries): %: vendor
	go build "./cmd/$*"

lint: vendor node_modules
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

fmt:
	gofmt -s -l -w ./cmd/ ./pkg/.

test: node_modules
	yarn test

vendor: Gopkg.lock
	dep ensure -vendor-only -v

node_modules:
	yarn install

app: node_modules
	yarn build --mode=production

clean:
	rm -rf \
		$(binaries) \
		*.tar \
		.gopath \
		build \
		node_modules \
		vendor \
		$(NULL)
