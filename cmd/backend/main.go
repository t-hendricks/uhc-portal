/*
Copyright (c) 2019 Red Hat, Inc.

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

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/golang/glog"
	"github.com/gorilla/handlers"
	"github.com/openshift-online/uhc-sdk-go/pkg/client"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
)

// #nosec G101
const authPath = "/auth/realms/redhat-external/protocol/openid-connect/auth"

// #nosec G101
const tokenPath = "/auth/realms/redhat-external/protocol/openid-connect/token"

// tokenEnv is the name of the environment variable that should contain the offline access token of
// the user.
const tokenEnv = "UHC_TOKEN"

// tokenPage is the URL of the page where the user can obtain the offline access token.
// If updating, be sure to keep README instructions in sync.
// #nosec G101
const tokenPage = "https://cloud.redhat.com/openshift/token"

var args struct {
	configFiles []string
}

var cmd = &cobra.Command{
	Use:  "backend",
	Long: "Fake backend used for development.",
	Run:  run,
}

func init() {
	// Send logs to the standard error stream by default:
	err := flag.Set("logtostderr", "true")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Can't set default error stream: %v\n", err)
		os.Exit(1)
	}

	// Register the options that are managed by the 'flag' package, so that they will also be parsed
	// by the 'pflag' package:
	pflag.CommandLine.AddGoFlagSet(flag.CommandLine)

	// Register the options:
	flags := cmd.Flags()
	flags.StringSliceVar(
		&args.configFiles,
		"config",
		[]string{},
		"The location of the configuration file. Can be used multiple times to specify "+
			"multiple configuration files or directories. They will be loaded in the "+
			"same order that they appear in the command line. When the value is a "+
			"directory all the files inside whose names end in .yml or .yaml will be "+
			"loaded, in alphabetical order.",
	)
}

func main() {
	// This is needed to make `glog` believe that the flags have already been parsed, otherwise
	// every log messages is prefixed by an error message stating the the flags haven't been
	// parsed.
	err := flag.CommandLine.Parse([]string{})
	if err != nil {
		fmt.Fprintf(os.Stderr, "Can't parse empty command line to satisfy 'glog': %v\n", err)
		os.Exit(1)
	}

	// Execute the command:
	cmd.SetArgs(os.Args[1:])
	err = cmd.Execute()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to execute command: %v\n", err)
		os.Exit(1)
	}
}

func run(cmd *cobra.Command, argv []string) {
	// Load the configuration:
	cfg, err := NewConfig().
		Files(args.configFiles).
		Build()
	if err != nil {
		glog.Errorf("Can't load configuration: %v", err)
		os.Exit(1)
	}

	// Get the offline access token:
	token := cfg.Token()
	if token == "" {
		token = os.Getenv(tokenEnv)
		if token == "" {
			glog.Errorf(
				"Either the 'token' parameter in the configuration file or the "+
					"environment variable '%s' must contain the offline "+
					"access token, but both are empty",
				tokenEnv,
			)
			glog.Infof("To obtain an offline access token go to '%s'", tokenPage)
			os.Exit(1)
		}
	}

	// Create the connection:
	logger, err := client.NewGoLoggerBuilder().
		Debug(true).
		Build()
	if err != nil {
		glog.Errorf("Can't create logger: %v", err)
		os.Exit(1)
	}
	connection, err := client.NewConnectionBuilder().
		Logger(logger).
		Client(cfg.Keycloak().ClientID(), cfg.Keycloak().ClientSecret()).
		TokenURL(cfg.Keycloak().URL()).
		Tokens(token).
		Build()
	if err != nil {
		glog.Errorf("Can't create connection: %v", err)
		os.Exit(1)
	}

	// Try to get a bearer token, just to verify that the connection is working and exit early if
	// it doesn't:
	_, _, err = connection.Tokens()
	if err != nil {
		glog.Errorf("Can't get bearer token: %v", err)
		os.Exit(1)
	}

	// Create the session store:
	store, err := NewSessionStore().
		Build()
	if err != nil {
		glog.Errorf("Can't create session store: %v", err)
		os.Exit(1)
	}

	// Create the main multiplexer:
	mainMux := http.NewServeMux()

	// Create the proxy handlers:
	for _, proxyCfg := range cfg.Proxies() {
		glog.Infof(
			"Creating proxy for prefix '%s' and target '%s'",
			proxyCfg.Prefix(), proxyCfg.Target(),
		)
		proxyHandler, err := NewProxyHandler().
			Target(proxyCfg.Target()).
			Connection(connection).
			Sessions(store).
			Build()
		if err != nil {
			glog.Errorf("Can't create proxy handler: %v", err)
			os.Exit(1)
		}
		mainMux.Handle(proxyCfg.Prefix(), proxyHandler)
	}

	// Create the authentication handlers:
	tokenURL := cfg.Keycloak().URL()
	glog.Infof("Creating auth handler at '%s' that calls '%s'", authPath, tokenURL)
	var authHandler http.Handler
	authHandler, err = NewAuthHandler().
		Sessions(store).
		Connection(connection).
		Build()
	if err != nil {
		glog.Errorf("Can't create authentication handler: %v", err)
		os.Exit(1)
	}
	glog.Infof("Creating token handler at '%s'", tokenPath)
	var tokenHandler http.Handler
	tokenHandler, err = NewTokenHandler().
		Sessions(store).
		Build()
	if err != nil {
		glog.Errorf("Can't create token handler: %v", err)
		os.Exit(1)
	}

	// The API handler doesn't need explicit CORS support, as the real gateway will already
	// support it, but the authentication and token handlers do need it:
	corsMiddleware := handlers.CORS(
		handlers.AllowedMethods([]string{
			http.MethodDelete,
			http.MethodGet,
			http.MethodPatch,
			http.MethodPost,
		}),
		handlers.AllowedHeaders([]string{
			"Authorization",
			"Content-Type",
		}),
		handlers.AllowedOrigins([]string{
			"http://localhost:8001",
		}),
		handlers.AllowCredentials(),
	)
	authHandler = corsMiddleware(authHandler)
	tokenHandler = corsMiddleware(tokenHandler)

	// Add the authentication handlers to the multiplexer:
	mainMux.Handle(authPath, authHandler)
	mainMux.Handle(tokenPath, tokenHandler)

	// Enable access logs:
	logHandler := handlers.LoggingHandler(os.Stdout, mainMux)

	// Start the web server:
	go http.ListenAndServe(cfg.Listener().Address(), logHandler)
	glog.Infof("Listening in 'http://%s'", cfg.Listener().Address())

	// Wait for the stop signal:
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, syscall.SIGINT)
	signal.Notify(signals, syscall.SIGTERM)
	for {
		<-signals
		break
	}

	// Bye:
	os.Exit(0)
}
