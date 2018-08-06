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

# The details of the image:
registry:=quay.io
repository:=openshift-unified-hybrid-cloud/portal
version:=latest

# The tag that will be assigned to the image:
tag:=$(registry)/$(repository):$(version)

# The name of the tar file for the image:
tar:=$(shell echo $(tag) | tr /:. ---).tar

# The details of the application:
namespace:=unified-hybrid-cloud
domain:=cloud.openshift.com

# The default image pull policy:
pull_policy:=IfNotPresent

.PHONY: \
	app \
	clean \
	image \
	push \
	tar \
	$(NULL)

app:
	yarn install
	yarn build

image:
	docker build -t $(tag) .

tar:
	docker save -o $(tar) $(tag)

push:
	docker push $(tag)

deploy:
	oc process \
		--filename="template.yml" \
		--param=DOMAIN="$(domain)" \
		--param=IMAGE="$(tag)" \
		--param=NAMESPACE="$(namespace)" \
		--param=VERSION="$(version)" \
		--param=PULL_POLICY="$(pull_policy)" \
	| \
	oc apply \
		--filename=-

clean:
	rm -rf build node_modules *.tar
