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

.PHONY: clean
clean:
	rm -rf \
		$(binaries) \
		build \
		node_modules \
		$(NULL)
