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
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
)

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
			Sessions(store).
			Build()
		if err != nil {
			glog.Errorf("Can't create API handler: %v", err)
			os.Exit(1)
		}
		mainMux.Handle(proxyCfg.Prefix(), proxyHandler)
	}

	// Create the authentication handlers:
	var authHandler http.Handler
	authHandler, err = NewAuthHandler().
		Sessions(store).
		Build()
	if err != nil {
		glog.Errorf("Can't create authentication handler: %v", err)
		os.Exit(1)
	}
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
	mainMux.Handle("/auth/realms/rhd/protocol/openid-connect/auth", authHandler)
	mainMux.Handle("/auth/realms/rhd/protocol/openid-connect/token", tokenHandler)

	// Enable access logs:
	logger := handlers.LoggingHandler(os.Stdout, mainMux)

	// Start the web server:
	go http.ListenAndServe(cfg.Listener().Address(), logger)
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
