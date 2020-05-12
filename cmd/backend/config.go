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

// This file contains the implementation of the configuration object.

package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/ghodss/yaml"
	"github.com/golang/glog"
)

// ConfigBuilder contains the data and the methods needed to load the service configuration.
type ConfigBuilder struct {
	files []string
}

// Config is a read only view of the configuration of the server.
type Config struct {
	listener *Listener
	keycloak *Keycloak
	proxies  []*Proxy
	token    string
	tokenMap map[string]string
}

// NewConfig creates a builder that can then be used to create new configuration objects.
func NewConfig() *ConfigBuilder {
	return new(ConfigBuilder)
}

// File adds the given file to the set of configuration files that will be loaded.
func (b *ConfigBuilder) File(value string) *ConfigBuilder {
	b.files = append(b.files, value)
	return b
}

// Files adds the given files to the set of configuration files that will be loaded.
func (b *ConfigBuilder) Files(values []string) *ConfigBuilder {
	b.files = append(b.files, values...)
	return b
}

// Build loads the configuration files and returns the resulting configuration object.
func (b *ConfigBuilder) Build() (config *Config, err error) {
	// Create the object:
	config = &Config{
		listener: &Listener{},
		keycloak: &Keycloak{},
		proxies:  []*Proxy{},
		tokenMap: make(map[string]string),
	}

	// Load the defaults:
	err = config.mergeText(defaultConfig)
	if err != nil {
		return
	}

	// Load the files:
	err = config.mergeFiles(b.files)
	if err != nil {
		return
	}

	return
}

// Listener returns the listener configuration.
func (c *Config) Listener() *Listener {
	return c.listener
}

// Proxies returns the list of proxies.
func (c *Config) Proxies() []*Proxy {
	return c.proxies
}

// Keycloak returns the keycloak configuration.
func (c *Config) Keycloak() *Keycloak {
	return c.keycloak
}

// Token returns the offline access token.
func (c *Config) Token() string {
	return c.token
}

// configData is the struct used internally to unmarshall the configuration data.
type configData struct {
	Listener *listenerData     `json:"listener,omitempty"`
	Keycloak *keycloakData     `json:"keycloak,omitempty"`
	Proxies  []*proxyData      `json:"proxies,omitempty"`
	Token    *string           `json:"token,omitempty"` // default token
	TokenMap map[string]string `json:"token_map,omitempty"`
}

// load loads the configuration data from the given files.
func (c *Config) mergeFiles(files []string) error {
	for _, file := range files {
		info, err := os.Stat(file)
		if os.IsNotExist(err) {
			return fmt.Errorf(
				"configuration file '%s' doesn't exist",
				file,
			)
		}
		if err != nil {
			return fmt.Errorf(
				"can't check if '%s' is a file or a directory: %v",
				file, err,
			)
		}
		if info.IsDir() {
			err = c.mergeDir(file)
			if err != nil {
				return fmt.Errorf(
					"can't load configuration directory '%s': %v",
					file, err,
				)
			}
		} else {
			err = c.mergeFile(file)
			if err != nil {
				return fmt.Errorf(
					"can't load configuration file '%s': %v",
					file, err,
				)
			}
		}
	}

	return nil
}

func (c *Config) mergeDir(dir string) error {
	// List the files in the directory:
	infos, err := ioutil.ReadDir(dir)
	if err != nil {
		return err
	}
	files := make([]string, 0, len(infos))
	for _, info := range infos {
		if !info.IsDir() {
			name := info.Name()
			if strings.HasSuffix(name, ".yml") || strings.HasSuffix(name, ".yaml") {
				file := filepath.Join(dir, name)
				files = append(files, file)
			}
		}
	}

	// Load the files in alphabetical order:
	sort.Strings(files)
	for _, file := range files {
		err := c.mergeFile(file)
		if err != nil {
			return err
		}
	}

	return nil
}

func (c *Config) mergeFile(file string) error {
	glog.Infof("Loading configuration file '%s'", file)
	var text []byte
	// #nosec G304
	text, err := ioutil.ReadFile(file)
	if err != nil {
		return err
	}
	return c.mergeText(text)
}

func (c *Config) mergeText(text []byte) error {
	// Parse the YAML text:
	var data configData
	err := yaml.Unmarshal(text, &data)
	if err != nil {
		return err
	}

	// Merge the configuration data from the file with the existing configuration:
	if data.Listener != nil {
		err = c.listener.merge(data.Listener)
		if err != nil {
			return err
		}
	}
	if data.Keycloak != nil {
		err = c.keycloak.merge(data.Keycloak)
		if err != nil {
			return err
		}
	}
	if data.Token != nil {
		c.token = *data.Token
	}
	for _, item := range data.Proxies {
		err = c.mergeProxies(item)
		if err != nil {
			return err
		}
	}

	if data.TokenMap != nil {
		for key, value := range data.TokenMap {
			if _, ok := c.tokenMap[key]; ok {
				glog.Errorf("Duplicate user %v, overriding previous token", key)
				return fmt.Errorf("duplicate user %v, overriding previous token", key)
			}
			c.tokenMap[key] = value
		}
	}

	return nil
}

func (c *Config) mergeProxies(data *proxyData) error {
	var proxy *Proxy
	if data.Prefix != nil {
		for _, candidate := range c.proxies {
			if candidate.prefix == *data.Prefix {
				proxy = candidate
			}
		}
	}
	if proxy == nil {
		proxy = new(Proxy)
		c.proxies = append(c.proxies, proxy)
	}
	err := proxy.merge(data)
	if err != nil {
		return err
	}

	return nil
}

// Keycloak is a read only view of the keycloak configuration.
type Keycloak struct {
	url          string
	clientID     string
	clientSecret string
}

// URL returns the keycloak token URL the client should use to obtain tokens to.
func (k *Keycloak) URL() string {
	return k.url
}

// ClientID returns the keycloak client ID.
func (k *Keycloak) ClientID() string {
	return k.clientID
}

// ClientSecret returns the keycloak client secret.
func (k *Keycloak) ClientSecret() string {
	return k.clientSecret
}

// keycloakData is the struct used internally to unmarshal the keycloak configuration.
type keycloakData struct {
	URL          *string `json:"url,omitempty"`
	ClientID     *string `json:"client_id,omitempty"`
	ClientSecret *string `json:"client_secret,omitempty"`
}

func (k *Keycloak) merge(data *keycloakData) error {
	if data.URL != nil {
		k.url = *data.URL
	}
	if data.ClientID != nil {
		k.clientID = *data.ClientID
	}
	if data.ClientSecret != nil {
		k.clientSecret = *data.ClientSecret
	}
	return nil
}

// Listener is a read only view of the listener configuration.
type Listener struct {
	address string
}

// Address returns the listening address.
func (l *Listener) Address() string {
	return l.address
}

// listenerData is the struct used internally to unmarshal the listener configuration.
type listenerData struct {
	Address *string `json:"address,omitempty"`
}

// merge processes the unmarshalled configuration data and merges it with this listener
// configuration.
func (l *Listener) merge(data *listenerData) error {
	if data.Address != nil {
		l.address = *data.Address
	}
	return nil
}

// Proxy is a read only view of section of the configuration that describes a proxy configuration.
type Proxy struct {
	prefix string
	target string
}

// Prefix returns the path prefix of this proxy.
func (p *Proxy) Prefix() string {
	return p.prefix
}

// Target returns the target address of this proxy.
func (p *Proxy) Target() string {
	return p.target
}

// proxyData is the struct used internally to unmarshal the proxy configuration.
type proxyData struct {
	Prefix *string `json:"prefix,omitempty"`
	Target *string `json:"target,omitempty"`
}

// merge processes the unmarshalled configuration data and merges it with this proxy configuration.
func (p *Proxy) merge(data *proxyData) error {
	if data.Prefix != nil {
		p.prefix = *data.Prefix
	}
	if data.Target != nil {
		p.target = *data.Target
	}
	return nil
}

// defaultConfig is the default configuration that is always loaded before any configuration file.
var defaultConfig = []byte(`
listener:
  address: localhost:8010

keycloak:
  url: https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token
  client_id: cloud-services
  client_secret:

proxies:
- prefix: /api/
  target: https://api.stage.openshift.com
`)
