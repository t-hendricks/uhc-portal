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

# The details of the build:
build_id:=unknown
build_ts:=$(shell date --utc --iso-8601=seconds)

# The details of the application:
binary:=portal
namespace:=unified-hybrid-cloud
version:=latest

# The details of the image:
image_registry:=quay.io
image_repository:=app-sre/uhc-portal
image:=$(image_registry)/$(image_repository)
image_tag:=$(version)
image_tar:=$(shell echo $(image_tag) | tr /:. ---).tar
image_pull_policy:=IfNotPresent

# The DNS domain names of the gateway and the portal:
gateway_domain:=api.127.0.0.1.nip.io
portal_domain:=cloud.127.0.0.1.nip.io

# Keycloak details:
keycloak_url:=https://developers.redhat.com/auth
keycloak_realm:=rhd
keycloak_client_id:=uhc

# Installer URL:
installer_url:=https://github.com/openshift/installer/releases

# Documentation URL:
documentation_url:=https://github.com/openshift/installer/blob/master/README.md#quick-start

# Terraform install URL:
terraform_install_url:=https://www.terraform.io/downloads.html

.PHONY: \
	app \
	binary \
	clean \
	deploy \
	fmt \
	image \
	lint \
	node_modules \
	push \
	tar \
	template \
	undeploy \
	$(NULL)

binary: vendor
	go build -o "$(binary)"

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
	gofmt -s -l -w main.go ./cmd/ ./pkg/.

test: vendor
	go test ./cmd/... ./pkg/...

vendor: Gopkg.lock
	dep ensure -vendor-only -v

node_modules:
	yarn install

app: node_modules
	yarn build --mode=production

image:
	docker build -t $(image):$(image_tag) .

tar:
	docker save -o $(image_tar) $(image):$(image_tag)

push:
	docker push $(image):$(image_tag)

template:
	oc process \
		--filename="template.yml" \
		--local="true" \
		--param="BUILD_ID=$(build_id)" \
		--param="BUILD_TS=$(build_ts)" \
		--param="GATEWAY_DOMAIN=$(gateway_domain)" \
		--param="IMAGE=$(image)" \
		--param="IMAGE_PULL_POLICY=$(image_pull_policy)" \
		--param="IMAGE_TAG=$(image_tag)" \
		--param="INSTALLER_URL=$(installer_url)" \
		--param="DOCUMENTATION_URL=$(documentation_url)" \
		--param="TERRAFORM_INSTALL_URL=$(terraform_install_url)" \
		--param="KEYCLOAK_CLIENT_ID=$(keycloak_client_id)" \
		--param="KEYCLOAK_REALM=$(keycloak_realm)" \
		--param="KEYCLOAK_URL=$(keycloak_url)" \
		--param="NAMESPACE=$(namespace)" \
		--param="PORTAL_DOMAIN=$(portal_domain)" \
		--param="VERSION=$(version)" \
	> template.json

deploy: template
	oc new-project "$(namespace)" || oc project "$(namespace)" || true
	oc apply --filename="template.json"

undeploy: template
	oc delete --filename="template.json"

clean:
	rm -rf \
		$(binary) \
		*.tar \
		.gopath \
		build \
		node_modules \
		template.json \
		$(NULL)
