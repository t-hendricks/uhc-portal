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

// This file contains the implementations of the handlers.

package main

import (
	"crypto/tls"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"

	"github.com/dgrijalva/jwt-go"
	"github.com/golang/glog"
)

// ProxyHandlerBuilder contains the configuration and logic needed to build proxy handlers.
type ProxyHandlerBuilder struct {
	target   string
	sessions *SessionStore
}

// ProxyHandler is an an HTTP handler that forwards requests to a real API gateway, replacing the
// authorization header with a valid token.
type ProxyHandler struct {
	target   *url.URL
	sessions *SessionStore
	parser   *jwt.Parser
	proxy    *httputil.ReverseProxy
}

// NewProxyHandler creates a builder that can then be used to configure and create an proxy handler.
func NewProxyHandler() *ProxyHandlerBuilder {
	return new(ProxyHandlerBuilder)
}

// Target sets the URL of the real API gateway.
func (b *ProxyHandlerBuilder) Target(value string) *ProxyHandlerBuilder {
	b.target = value
	return b
}

// Sessions sets the sessions store that will be used to obtain information about the authenticated
// users.
func (b *ProxyHandlerBuilder) Sessions(value *SessionStore) *ProxyHandlerBuilder {
	b.sessions = value
	return b
}

// Build uses the configuration stored in the builder to create a new proxy handler.
func (b *ProxyHandlerBuilder) Build() (handler *ProxyHandler, err error) {
	// Check mandatory parameters:
	if b.target == "" {
		err = fmt.Errorf("target URL is mandatory")
		return
	}
	if b.sessions == nil {
		err = fmt.Errorf("session store is mandatory")
		return
	}

	// Parse the target URL:
	target, err := url.Parse(b.target)
	if err != nil {
		err = fmt.Errorf("can't parse target URL '%s': %v", b.target, err)
		return
	}

	// The director doesn't do to do anything, as we do all the changes to the request in the
	// handler, because that way we can send more correct responses to the client if we find any
	// error:
	director := func(r *http.Request) {
		// Nothing.
	}

	// Create a transport that doesn't check TLS certificates or host names, as this is intended
	// for development environments where they are most probably not valid:
	// #nosec G402
	transport := &http.Transport{
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
	}

	// Create and populate the object:
	handler = new(ProxyHandler)
	handler.target = target
	handler.sessions = b.sessions
	handler.parser = &jwt.Parser{}
	handler.proxy = &httputil.ReverseProxy{
		Director:  director,
		Transport: transport,
	}

	return
}

// ServeHTTP is the implementation of the HTTP handler interface.
func (h *ProxyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != "OPTIONS" {
		// add authorization headers to all non-OPTIONS http requests
		err := h.insertAuthorizationHeader(w, r)
		if err != nil {
			return
		}
	}

	// Replace the scheme and host with the ones of the real gateway:
	r.URL.Scheme = h.target.Scheme
	r.URL.Host = h.target.Host
	r.Host = h.target.Host

	// Let the proxy do the rest of the work:
	h.proxy.ServeHTTP(w, r)
}

func (h *ProxyHandler) insertAuthorizationHeader(w http.ResponseWriter, r *http.Request) error {
	authorizationCode := r.Header.Get("Authorization")
	if authorizationCode == "" {
		glog.Warningf("Missing Authorization header, not adding our own")
		return nil
	}

	parsed, _, err := h.parser.ParseUnverified(strings.Split(authorizationCode, " ")[1], jwt.MapClaims{})
	if err != nil {
		glog.Errorf("Can't parse request Authorization header: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return err
	}
	username := parsed.Claims.(jwt.MapClaims)["username"].(string)
	if username == "" {
		glog.Errorf("Can't use request Authorization header: no username")
		w.WriteHeader(http.StatusUnauthorized)
		return fmt.Errorf("Can't use request Authorization header: no username")
	}

	session := h.sessions.Lookup(username)
	if session == nil {
		// We don't have ssesion for this user, which means they didn't appear in the config file
		// try the default token session instead
		if h.sessions.defaultSession == nil {
			glog.Errorf("No token for user %v and no default token, rejecting request", username)
			w.WriteHeader(http.StatusUnauthorized)
			return err
		}
		session = h.sessions.defaultSession
	}
	bearer, _, err := session.connection.Tokens()
	if err != nil {
		glog.Errorf("Can't get real token: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return err
	}
	authorization := fmt.Sprintf("Bearer %s", bearer)
	r.Header.Set("Authorization", authorization)
	return nil
}
