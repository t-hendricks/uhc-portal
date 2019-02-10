/*
Copyright (c) 2018 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package main

// This is a template used to generate the 'httpd.conf' file of the Apache web server that will do
// all the heavy lifting of the portal.
const httpdConfTemplate = `
# Explicilty set the server name, otherwise the web server will use
# the IP address of the pod:
ServerName {{ .PortalDomain }}

# Listen in a non privileged port, as we will be running with a non
# privileged user:
Listen 8000

# Load modules:
LoadModule mpm_event_module /usr/lib64/httpd/modules/mod_mpm_event.so
LoadModule unixd_module /usr/lib64/httpd/modules/mod_unixd.so
LoadModule dir_module /usr/lib64/httpd/modules/mod_dir.so
LoadModule log_config_module /usr/lib64/httpd/modules/mod_log_config.so
LoadModule authn_core_module /usr/lib64/httpd/modules/mod_authn_core.so
LoadModule authz_core_module /usr/lib64/httpd/modules/mod_authz_core.so
LoadModule authz_host_module /usr/lib64/httpd/modules/mod_authz_host.so
LoadModule rewrite_module /usr/lib64/httpd/modules/mod_rewrite.so
LoadModule alias_module /usr/lib64/httpd/modules/mod_alias.so
LoadModule mime_module /usr/lib64/httpd/modules/mod_mime.so
LoadModule status_module /usr/lib64/httpd/modules/mod_status.so

# Load MIME types:
TypesConfig /etc/mime.types

# Deny access to all the file system:
<Directory />
  AllowOverride none
  Require all denied
</Directory>

# Allow access to the documents directory:
DocumentRoot /var/www/html
<Directory /var/www/html>
  AllowOverride None

  # Allow access to everyone:
  Require all granted

  # Redirect all requests for files or directories that don't exist to the
  # index page of the application:
  RewriteEngine On
  RewriteBase /
  RewriteRule ^server-status$ - [L]
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</Directory>

# Allow access to the directory that contains application configuration files,
# including the config.json file:
Alias /config {{ .ConfigDir }}
<Directory {{ .ConfigDir }} >
  AllowOverride None
  Require all granted
</Directory>

# Send the logs to the standard output:
LogLevel warn
ErrorLog /dev/stdout
TransferLog /dev/stdout

<Location "/server-status">
  SetHandler server-status
  Require local
</Location>
`

// This is the template to generate the 'config.json' file.
const configJSONTemplate = `{
	"apiGateway": "https://{{ .GatewayDomain }}",
	"keycloak": {
		"realm": "{{ .KeycloakRealm }}",
		"clientId": "{{ .KeycloakClientID }}",
		"url": "{{ .KeycloakURL }}"
	},
	"installerURL": "{{ .InstallerURL }}",
	"documentationURL": "{{ .DocumentationURL }}",
	"terraformInstallURL": "{{ .TerraformInstallURL }}",
	"commandLineToolsURL": "{{ .CommandLineToolsURL }}"
}`
