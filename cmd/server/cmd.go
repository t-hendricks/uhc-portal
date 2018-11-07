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

package server

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"text/template"

	"github.com/golang/glog"
	"github.com/spf13/cobra"

	"gitlab.cee.redhat.com/service/uhc-portal/pkg/apache"
)

var args struct {
	portalDomain     string
	gatewayDomain    string
	keycloakRealm    string
	keycloakClientID string
	keycloakURL      string
	installerURL     string
	documentationURL string
}

// Cmd is the cobra serve command
var Cmd = &cobra.Command{
	Use:   "server",
	Short: "Run the portal server",
	Long:  "Run the portal server.",
	Run:   run,
}

func init() {
	flags := Cmd.Flags()
	flags.StringVar(
		&args.portalDomain,
		"portal-domain",
		"",
		"DNS domain where the portal will be accesible.",
	)
	flags.StringVar(
		&args.gatewayDomain,
		"gateway-domain",
		"",
		"DNS domain where the gateway will be accesible.",
	)
	flags.StringVar(
		&args.keycloakRealm,
		"keycloak-realm",
		"",
		"Keycloak realm.",
	)
	flags.StringVar(
		&args.keycloakClientID,
		"keycloak-client-id",
		"",
		"Keycloak client identifier.",
	)
	flags.StringVar(
		&args.keycloakURL,
		"keycloak-url",
		"",
		"Keycloak URL.",
	)
	flags.StringVar(
		&args.installerURL,
		"installer-url",
		"",
		"URL where the OpenShift installer can be downloaded from.",
	)
	flags.StringVar(
		&args.documentationURL,
		"documentation-url",
		"",
		"URL where the OpenShift documentation can be viewed.",
	)
}

func run(cmd *cobra.Command, argv []string) {
	var err error

	// Check mandatory options:
	ok := true
	if args.portalDomain == "" {
		glog.Errorf("Option '--portal-domain' is mandatory")
		ok = false
	}
	if args.gatewayDomain == "" {
		glog.Errorf("Option '--gateway-domain' is mandatory")
		ok = false
	}
	if args.keycloakRealm == "" {
		glog.Errorf("Option '--keycloak-realm' is mandatory")
		ok = false
	}
	if args.keycloakClientID == "" {
		glog.Errorf("Option '--keycloak-client-id' is mandatory")
		ok = false
	}
	if args.keycloakURL == "" {
		glog.Errorf("Option '--keycloak-url' is mandatory")
		ok = false
	}
	if args.installerURL == "" {
		glog.Errorf("Option '--installer-url' is mandatory")
		ok = false
	}
	if args.documentationURL == "" {
		glog.Errorf("Option '--documentation-url' is mandatory")
		ok = false
	}

	if !ok {
		os.Exit(1)
	}

	// Create the temporary directory containing the configuration files:
	configDir, err := createConfigDir()
	if err != nil {
		glog.Errorf("Can't create configuration directory: %v", err)
		os.Exit(1)
	}

	// Create the web server:
	webServer, err := apache.NewBuilder().
		Template(httpdConfTemplate).
		Variable("ConfigDir", configDir).
		Variable("PortalDomain", args.portalDomain).
		Build()
	if err != nil {
		glog.Errorf("Can't create the web server: %v", err)
		os.Exit(1)
	}

	// Start the Apache web server:
	err = webServer.Start()
	if err != nil {
		glog.Errorf("Can't start the web server: %v", err)
		os.Exit(1)
	}

	// Wait for the stop signal:
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT)
	signal.Notify(signals, syscall.SIGTERM)
	for {
		<-signals
		break
	}

	// Stop the Apache web server:
	err = webServer.Stop()
	if err != nil {
		glog.Errorf("Can't stop the web server: %v", err)
		os.Exit(1)
	}

	// Remove the temporary directory that was created for configuration files:
	glog.Infof("Removing temporary configuration directory '%s'", configDir)
	err = os.RemoveAll(configDir)
	if err != nil {
		glog.Errorf(
			"Can't remove temporary configuration directory '%s': %v",
			configDir, err,
		)
		os.Exit(1)
	}

	// Bye:
	os.Exit(0)
}

func createConfigDir() (configDir string, err error) {
	// Create a temporary directory for the configuration files:
	configDir, err = ioutil.TempDir("", "configuration.")
	if err != nil {
		err = fmt.Errorf("can't create temporary configuration directory: %v", err)
		return
	}
	glog.Infof("Temporary configuration directory is '%s'", configDir)

	// Process the 'config.json' template and write the result to a buffer:
	configJSONTmpl, err := template.New("config.json").Parse(configJSONTemplate)
	if err != nil {
		err = fmt.Errorf("can't parse configuration template: %v", err)
		return
	}
	configJSONData := map[string]string{
		"GatewayDomain":    args.gatewayDomain,
		"KeycloakRealm":    args.keycloakRealm,
		"KeycloakClientID": args.keycloakClientID,
		"KeycloakURL":      args.keycloakURL,
		"InstallerURL":     args.installerURL,
		"DocumentationURL": args.documentationURL,
	}
	configJSONBuffer := new(bytes.Buffer)
	err = configJSONTmpl.Execute(configJSONBuffer, configJSONData)
	if err != nil {
		err = fmt.Errorf("can't execute configuration template: %v", err)
		return
	}
	configJSONText := configJSONBuffer.String()
	glog.Infof("Generated configuration text follows\n%s\n", configJSONText)

	// Write the 'config.json' file:
	configJSONPath := filepath.Join(configDir, "config.json")
	glog.Infof("Writing generated configuration text to file '%s", configJSONPath)
	configJSONFile, err := os.Create(configJSONPath)
	if err != nil {
		err = fmt.Errorf("can't create configuration file '%s': %v", configJSONPath, err)
		return
	}
	_, err = configJSONBuffer.WriteTo(configJSONFile)
	if err != nil {
		err = fmt.Errorf("can't write configuration file '%s': %v", configJSONPath, err)
		return
	}

	return
}
