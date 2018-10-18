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
namespace:=unified-hybrid-cloud
version:=latest

# The details of the image:
image_registry:=quay.io
image_repository:=openshift-unified-hybrid-cloud/portal
image_tag:=$(image_registry)/$(image_repository):$(version)
image_tar:=$(shell echo $(image_tag) | tr /:. ---).tar
image_pull_policy:=IfNotPresent

# The DNS domain names of the gateway and the portal:
gateway_domain:=api.127.0.0.1.nip.io
portal_domain:=cloud.127.0.0.1.nip.io

# Keycloak details:
keycloak_url:=https://developers.stage.redhat.com/auth
keycloak_realm:=rhd
keycloak_client_id:=uhc

# Installer URL:
installer_url:=https://github.com/openshift/installer/releases

.PHONY: \
	app \
	clean \
	deploy \
	image \
	push \
	tar \
	template \
	undeploy \
	$(NULL)

app:
	yarn install
	yarn build --mode=production

image:
	docker build -t $(image_tag) .

tar:
	docker save -o $(image_tar) $(image_tag)

push:
	docker push $(image_tag)

template:
	oc process \
		--filename="template.yml" \
		--local="true" \
		--param="BUILD_ID=$(build_id)" \
		--param="BUILD_TS=$(build_ts)" \
		--param="GATEWAY_DOMAIN=$(gateway_domain)" \
		--param="IMAGE_PULL_POLICY=$(image_pull_policy)" \
		--param="IMAGE_TAG=$(image_tag)" \
		--param="KEYCLOAK_CLIENT_ID=$(keycloak_client_id)" \
		--param="KEYCLOAK_REALM=$(keycloak_realm)" \
		--param="KEYCLOAK_URL=$(keycloak_url)" \
		--param="NAMESPACE=$(namespace)" \
		--param="PORTAL_DOMAIN=$(portal_domain)" \
		--param="VERSION=$(version)" \
                --param="INSTALLER_URL=$(installer_url)" \
	> template.json

deploy: template
	oc new-project "$(namespace)" || oc project "$(namespace)" || true
	oc apply --filename="template.json"

undeploy: template
	oc delete --filename="template.json"

clean:
	rm -rf \
		*.tar \
		build \
		node_modules \
		template.json \
		$(NULL)
