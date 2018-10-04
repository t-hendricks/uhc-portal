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

FROM centos:7

COPY \
    redhat-it.pem \
    /etc/pki/ca-trust/source/anchors/

RUN \
    update-ca-trust

RUN \
    yum install -y \
    httpd \
    mod_auth_openidc \
    && \
    yum clean all

COPY build/ /var/www/html/

EXPOSE 8000

ENTRYPOINT ["/usr/sbin/httpd", "-D", "FOREGROUND"]
