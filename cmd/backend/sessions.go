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
	"sync"
)

// SessionStoreBuilder is used to create instances of session stores.
type SessionStoreBuilder struct {
}

// SessionStore manages a collection of sessions.
type SessionStore struct {
	mutex    *sync.Mutex
	sessions map[string]*Session
}

// NewSessionStore creates a new session store builder, that can then be used to configure and
// create a session store.
func NewSessionStore() *SessionStoreBuilder {
	return new(SessionStoreBuilder)
}

// Build uses the configuration stored in the builder to create a new session store.
func (b *SessionStoreBuilder) Build() (store *SessionStore, err error) {
	store = new(SessionStore)
	store.mutex = new(sync.Mutex)
	store.sessions = make(map[string]*Session)
	return
}

// Lookup returns the the session for the given user if it exists, or nil if it doesn't.
func (s *SessionStore) Lookup(user string) *Session {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	return s.sessions[user]
}

// Session builder contains the configuration and logic needed to create new sessions.
type SessionBuilder struct {
	store *SessionStore
	user  string
	mail  string
	nonce string
}

// Session contains the information about the user.
type Session struct {
	user  string
	mail  string
	nonce string
}

// New creates a builder that can then be used to create new sessions.
func (s *SessionStore) New() *SessionBuilder {
	builder := new(SessionBuilder)
	builder.store = s
	return builder
}

// User sets the user name of the session.
func (b *SessionBuilder) User(value string) *SessionBuilder {
	b.user = value
	return b
}

// Mail sets the mail address of the user of the session.
func (b *SessionBuilder) Mail(value string) *SessionBuilder {
	b.mail = value
	return b
}

// Nonce sets the nonce that will be used to issue tokens.
func (b *SessionBuilder) Nonce(value string) *SessionBuilder {
	b.nonce = value
	return b
}

// Build uses the configuration stored in the builder to add a new session to the store.
func (b *SessionBuilder) Build() (session *Session, err error) {
	// Check parameters:
	if b.user == "" {
		err = fmt.Errorf("user name is mandatory")
		return
	}
	if b.nonce == "" {
		err = fmt.Errorf("nonce is mandatory")
		return
	}

	// Create the session:
	session = new(Session)
	session.user = b.user
	session.mail = b.mail
	session.nonce = b.nonce

	// Add the session to the store:
	b.store.mutex.Lock()
	b.store.sessions[b.user] = session
	b.store.mutex.Unlock()

	return
}

// User returns the user name of the session.
func (s *Session) User() string {
	return s.user
}

// Mail returns the mail address of the user of the session.
func (s *Session) Mail() string {
	return s.mail
}

// Nonce returns the nonce that should be used to issue tokens for the user.
func (s *Session) Nonce() string {
	return s.nonce
}
