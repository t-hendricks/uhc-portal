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
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/golang/glog"
	"github.com/openshift-online/uhc-sdk-go/pkg/client"
)

// AuthHandlerBuilder contains the configuration and logic needed to create an authentication
// handler.
type AuthHandlerBuilder struct {
	sessions   *SessionStore
	connection *client.Connection
}

// AuthHandler is an authentication handler.
type AuthHandler struct {
	sessions   *SessionStore
	parser     *jwt.Parser
	connection *client.Connection
}

// NewAuthHandler creates a builder that can then be used to configure and create authentication
// handlers.
func NewAuthHandler() *AuthHandlerBuilder {
	return new(AuthHandlerBuilder)
}

// Sessions set the session store that the authentication handler will use to store information
// about users.
func (b *AuthHandlerBuilder) Sessions(value *SessionStore) *AuthHandlerBuilder {
	b.sessions = value
	return b
}

// Connection sets the connection to the server that will be used to obtain access tokens.
func (b *AuthHandlerBuilder) Connection(value *client.Connection) *AuthHandlerBuilder {
	b.connection = value
	return b
}

// Build uses the configuration stored in the builder to create a new authentication handler.
func (b *AuthHandlerBuilder) Build() (handler *AuthHandler, err error) {
	// Check parameters:
	if b.sessions == nil {
		err = fmt.Errorf("session store is mandatory")
		return
	}
	if b.connection == nil {
		err = fmt.Errorf("connection is mandatory")
		return
	}

	// Create the object:
	handler = new(AuthHandler)
	handler.sessions = b.sessions
	handler.parser = &jwt.Parser{}
	handler.connection = b.connection

	return
}

// ServeHTTP is the implementation of the HTTP handler interface.
func (h *AuthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Parse the form:
	err := r.ParseForm()
	if err != nil {
		glog.Errorf("Can't parse form: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	form := r.Form
	nonce := form.Get("nonce")
	redirectURI := form.Get("redirect_uri")
	responseMode := form.Get("response_mode")
	responseType := form.Get("response_type")
	state := form.Get("state")

	// Check the form:
	ok := true
	if responseMode != "fragment" {
		glog.Errorf("Expected response mode 'fragment' but got '%s'", responseMode)
		ok = false
	}
	if responseType != "code" {
		glog.Errorf("Expected response type 'code' but got '%s'", responseType)
		ok = false
	}
	if !ok {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// Get a bearer token for the user:
	bearer, _, err := h.connection.Tokens()
	if err != nil {
		glog.Errorf("Can't get token '%s': %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Get the user name:
	claims := jwt.MapClaims{}
	_, _, err = h.parser.ParseUnverified(bearer, claims)
	if err != nil {
		glog.Errorf("Can't parse bearer token '%s': %v", bearer, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	userClaim, ok := claims["preferred_username"]
	if !ok {
		glog.Errorf("Can't get 'preferred_username' claim. Trying 'username'...")
		userClaim, ok = claims["username"]
		if !ok {
			glog.Errorf("Can't get 'username' claim.")
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}
	user, ok := userClaim.(string)
	if !ok {
		glog.Errorf(
			"Expected username claim containing string but got '%T'",
			userClaim,
		)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	mailClaim, ok := claims["email"]
	if !ok {
		glog.Errorf("Can't get 'email' claim")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	mail, ok := mailClaim.(string)
	if !ok {
		glog.Errorf(
			"Expected 'email' claim containing string but got '%T'",
			mailClaim,
		)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Create a session for the user:
	_, err = h.sessions.New().
		User(user).
		Mail(mail).
		Nonce(nonce).
		Build()
	if err != nil {
		glog.Errorf("Can't create session for user '%s': %v", user, err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Redirect to the requested location:
	location := fmt.Sprintf("%s#state=%s&code=%s", redirectURI, state, user)
	w.Header().Set("Location", location)
	w.WriteHeader(http.StatusFound)
}

// TokenHandlerBuilder contains the configuration and logic needed to create a token handler.
type TokenHandlerBuilder struct {
	sessions *SessionStore
}

// TokenHandler knows how to handle token requests.
type TokenHandler struct {
	sessions *SessionStore
	parser   *jwt.Parser
}

// NewTokenHandler creates a builder that can then be used to create token handlers.
func NewTokenHandler() *TokenHandlerBuilder {
	return new(TokenHandlerBuilder)
}

// Sessions sets the session store that will be used to find information about authenticated users.
func (b *TokenHandlerBuilder) Sessions(value *SessionStore) *TokenHandlerBuilder {
	b.sessions = value
	return b
}

// Build uses the configuration stored in the builder to create a new token handler.
func (b *TokenHandlerBuilder) Build() (handler *TokenHandler, err error) {
	// Check parameters:
	if b.sessions == nil {
		err = fmt.Errorf("session store is mandatory")
		return
	}

	// Create the object:
	handler = new(TokenHandler)
	handler.sessions = b.sessions
	handler.parser = &jwt.Parser{}

	return
}

// ServeHTTP is the implementation of the HTTP handler interface.
func (h *TokenHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Parse the form:
	err := r.ParseForm()
	if err != nil {
		glog.Errorf("Can't parse form: %v", err)
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Can't parse form",
		)
		return
	}

	// Perform the requested grant:
	grantType := r.Form.Get("grant_type")
	if grantType == "" {
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Grant type isn't provided",
		)
		return
	}
	switch grantType {
	case "authorization_code":
		h.handleAuthorizationCodeGrant(w, r)
	case "refresh_token":
		h.handleRefreshTokenGrant(w, r)
	default:
		glog.Errorf("Grant type '%s' isn't supported", grantType)
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Grant type isn't supported",
		)
		return
	}
}

func (h *TokenHandler) handleAuthorizationCodeGrant(w http.ResponseWriter, r *http.Request) {
	// Get the session:
	code := r.Form.Get("code")
	if code == "" {
		glog.Errorf("Authorization code isn't provided")
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Authorization code isn't provided",
		)
		return
	}
	session := h.sessions.Lookup(code)
	if session == nil {
		glog.Errorf("Can't find session for code '%s'", code)
		h.sendError(
			w, r,
			http.StatusUnauthorized,
			"unauthorized",
			"Authorization code isn't valid",
		)
		return
	}

	// Send the tokens:
	h.sendTokens(w, r, session)
}

func (h *TokenHandler) handleRefreshTokenGrant(w http.ResponseWriter, r *http.Request) {
	// Get the user name:
	token := r.Form.Get("refresh_token")
	if token == "" {
		glog.Errorf("Refresh token isn't provided")
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Refresh token isn't provided",
		)
		return
	}
	claims := jwt.MapClaims{}
	_, _, err := h.parser.ParseUnverified(token, claims)
	if err != nil {
		glog.Errorf("Can't parse refresh token '%s': %v", token, err)
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Refresh token isn't valid",
		)
		return
	}
	claim, ok := claims["sub"]
	if !ok {
		glog.Errorf("Refresh token doesn't contain the 'sub' claim")
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"Refresh token doesn't contain the 'sub' claim",
		)
		return
	}
	user, ok := claim.(string)
	if !ok {
		glog.Errorf(
			"Expected subject claim containing string but got '%T'",
			claim,
		)
		h.sendError(
			w, r,
			http.StatusBadRequest,
			"bad_request",
			"The 'sub' claim isn't valid",
		)
		return
	}

	// Get the session:
	session := h.sessions.Lookup(user)
	if session == nil {
		glog.Errorf("Can't find session for user '%s'", user)
		h.sendError(
			w, r,
			http.StatusUnauthorized,
			"unauthorized",
			"User is not logged in",
		)
		return
	}

	// Send the tokens:
	h.sendTokens(w, r, session)
}

func (h *TokenHandler) sendTokens(w http.ResponseWriter, r *http.Request, session *Session) {
	idToken, err := h.makeIDToken(session)
	if err != nil {
		glog.Errorf("Can't create identity token: %v", err)
		h.sendError(
			w, r,
			http.StatusInternalServerError,
			"internal_error",
			"Can't create identity token",
		)
		return
	}
	accessToken, err := h.makeAccessToken(session)
	if err != nil {
		glog.Errorf("Can't create access token: %v", err)
		h.sendError(
			w, r,
			http.StatusInternalServerError,
			"internal_error",
			"Can't create access token",
		)
		return
	}
	refreshToken, err := h.makeRefreshToken(session)
	if err != nil {
		glog.Errorf("Can't create refresh token: %v", err)
		h.sendError(
			w, r,
			http.StatusInternalServerError,
			"internal_error",
			"Can't create refresh token",
		)
		return
	}
	body := []byte(fmt.Sprintf(
		`{
			"id_token": "%s",
			"access_token": "%s",
			"expires_in": %d,
			"refresh_token": "%s",
			"refresh_expires_in": %d,
			"token_type": "bearer"
		}`,
		idToken,
		accessToken,
		int(accessExpiry.Seconds()),
		refreshToken,
		int(refreshExpiry.Seconds()),
	))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, err = w.Write(body)
	if err != nil {
		glog.Errorf("Can't send token: %v", err)
	}
}

func (h *TokenHandler) sendError(w http.ResponseWriter, r *http.Request, status int, reason, description string) {
	body := []byte(fmt.Sprintf(
		`{
			"error": "%s",
			"error_description": "%s"
		}`,
		reason,
		description,
	))
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_, err := w.Write(body)
	if err != nil {
		glog.Errorf("Can't send error: %v", err)
	}
}

func (h *TokenHandler) makeIDToken(session *Session) (token string, err error) {
	issue := time.Now()
	expiry := issue.Add(accessExpiry)
	claims := jwt.MapClaims{
		"email":              session.Mail(),
		"exp":                expiry.Unix(),
		"iat":                issue.Unix(),
		"nonce":              session.Nonce(),
		"preferred_username": session.User(),
		"sub":                session.User(),
		"typ":                "ID",
	}
	plain := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	plain.Header["kid"] = "0"
	token, err = plain.SignedString(jwksPrivateKey)
	return
}

func (h *TokenHandler) makeAccessToken(session *Session) (token string, err error) {
	issue := time.Now()
	expiry := issue.Add(accessExpiry)
	claims := jwt.MapClaims{
		"email":              session.Mail(),
		"exp":                expiry.Unix(),
		"iat":                issue.Unix(),
		"nonce":              session.Nonce(),
		"preferred_username": session.User(),
		"sub":                session.User(),
		"typ":                "Bearer",
	}
	plain := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	plain.Header["kid"] = "0"
	token, err = plain.SignedString(jwksPrivateKey)
	return
}

func (h *TokenHandler) makeRefreshToken(session *Session) (token string, err error) {
	issue := time.Now()
	expiry := issue.Add(refreshExpiry)
	claims := jwt.MapClaims{
		"email":              session.Mail(),
		"exp":                expiry.Unix(),
		"iat":                issue.Unix(),
		"nonce":              session.Nonce(),
		"preferred_username": session.User(),
		"sub":                session.User(),
		"typ":                "Refresh",
	}
	plain := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	plain.Header["kid"] = "0"
	token, err = plain.SignedString(jwksPrivateKey)
	return
}

const (
	accessExpiry  = 5 * time.Minute
	refreshExpiry = 10 * time.Hour
)

// ProxyHandlerBuilder contains the configuration and logic needed to build proxy handlers.
type ProxyHandlerBuilder struct {
	connection *client.Connection
	target     string
	sessions   *SessionStore
}

// ProxyHandler is an an HTTP handler that forwards requests to a real API gateway, replacing the
// authorization header with a valid token.
type ProxyHandler struct {
	connection *client.Connection
	target     *url.URL
	sessions   *SessionStore
	parser     *jwt.Parser
	proxy      *httputil.ReverseProxy
}

// NewProxyHandler creates a builder that can then be used to configure and create an proxy handler.
func NewProxyHandler() *ProxyHandlerBuilder {
	return new(ProxyHandlerBuilder)
}

// Connection sets the connection that will be used to obtain real bearer tokens for the user.
func (b *ProxyHandlerBuilder) Connection(value *client.Connection) *ProxyHandlerBuilder {
	b.connection = value
	return b
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
	if b.connection == nil {
		err = fmt.Errorf("connection mandatory")
		return
	}
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
	handler.connection = b.connection
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
	err := h.insertAuthorizationHeader(w, r)
	if err != nil {
		return
	}

	// Replace the scheme and host with the ones of the real gateway:
	r.URL.Scheme = h.target.Scheme
	r.URL.Host = h.target.Host
	r.Host = h.target.Host

	// Let the proxy do the rest of the work:
	h.proxy.ServeHTTP(w, r)
}

func (h *ProxyHandler) insertAuthorizationHeader(w http.ResponseWriter, r *http.Request) error {
	bearer, _, err := h.connection.Tokens()
	if err != nil {
		glog.Errorf("Can't get real token: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return err
	}
	authorization := fmt.Sprintf("Bearer %s", bearer)
	r.Header.Set("Authorization", authorization)
	return nil
}
