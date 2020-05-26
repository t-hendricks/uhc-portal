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

// This file contains the implementation of the sessions, used to store information about
// authenticated users.

package main

import (
	"fmt"
	"os"
	"sync"

	"github.com/golang/glog"
	sdk "github.com/openshift-online/ocm-sdk-go"
)

// SessionStoreBuilder is used to create instances of session stores.
type SessionStoreBuilder struct {
	config *Config
	logger sdk.Logger
}

// SessionStore manages a collection of sessions.
type SessionStore struct {
	mutex          *sync.Mutex
	sessions       map[string]*Session
	config         *Config
	logger         sdk.Logger
	defaultSession *Session
}

// NewSessionStore creates a new session store builder, that can then be used to configure and
// create a session store.
func NewSessionStore(cfg *Config, logger sdk.Logger) *SessionStoreBuilder {
	b := new(SessionStoreBuilder)
	b.config = cfg
	b.logger = logger
	return b
}

// Build uses the configuration stored in the builder to create a new session store.
func (b *SessionStoreBuilder) Build() (store *SessionStore, err error) {
	store = new(SessionStore)
	store.mutex = new(sync.Mutex)
	store.sessions = make(map[string]*Session)
	store.config = b.config
	store.logger = b.logger

	// Create sessions for all users in the config files
	// creating them ahead-of-time avoids race conditions of session creation
	// if the user sends two requests at the same time.
	// it also allows validating the entire token map on startup, so we bail early if these tokens are invalid
	if b.config.tokenMap != nil {
		for username := range b.config.tokenMap {
			glog.Infof("Creating session for user %v", username)
			_, err = store.New(username)
			if err != nil {
				glog.Errorf("Can't create session for %v: %v", username, err)
				return
			}
		}
	}
	if os.Getenv(tokenEnv) != "" || b.config.token != "" {
		// Got a global token, create the default session.
		// Creating this ahead of time is also done to avoid noise of few connections being created at the same time
		// when the requests happen all at once
		glog.Infof("Creating the default session")
		store.defaultSession, err = store.New("__OCM_BACKEND_PROXY_DEFAULT_SESSION__")
		if err != nil {
			glog.Errorf("Can't create default session: %v", err)
			return
		}
	}

	return
}

// Lookup returns the the session for the given user if it exists, or nil if it doesn't.
func (s *SessionStore) Lookup(user string) *Session {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	return s.sessions[user]
}

// Session contains the information about the user.
type Session struct {
	user       string
	connection *sdk.Connection
}

// New creates a builder that can then be used to create new sessions.
func (s *SessionStore) New(username string) (session *Session, err error) {
	// Check parameters:
	if username == "" {
		err = fmt.Errorf("username is mandatory")
		return
	}

	glog.Infof("Creating a new session for user %v", username)

	token := ""
	if _, ok := s.config.tokenMap[username]; ok {
		glog.Infof("Using token for %v from token_map in the config file", username)
		token = s.config.tokenMap[username]
	} else if os.Getenv(tokenEnv) != "" {
		glog.Infof("Using token for %v from environment", username)
		token = os.Getenv(tokenEnv)
	} else {
		glog.Infof("Using token for %v from default token in config file", username)
		token = s.config.token
	}
	if token == "" {
		glog.Errorf("Can't create connection for user %v: no token", username)
		err = fmt.Errorf("Can't create connection for user %v: no token", username)
		return
	}

	// Create the session:
	session = new(Session)
	session.user = username

	connection, err := sdk.NewConnectionBuilder().
		Logger(s.logger).
		Client(s.config.Keycloak().ClientID(), s.config.Keycloak().ClientSecret()).
		TokenURL(s.config.Keycloak().URL()).
		Tokens(token).
		Build()
	if err != nil {
		glog.Errorf("Can't create connection: %v", err)
		err = fmt.Errorf("Can't create connection: %v", err)
		return
	}
	session.connection = connection

	// Try to get a bearer token, just to verify that the connection is working and exit early if
	// it doesn't:
	_, _, err = connection.Tokens()
	if err != nil {
		glog.Errorf("Can't get bearer token: %v", err)
		err = fmt.Errorf("Can't get bearer token: %v", err)
		return
	}

	// Add the session to the store:
	s.mutex.Lock()
	s.sessions[username] = session
	s.mutex.Unlock()

	return
}
