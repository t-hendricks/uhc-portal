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

// This file contains the constants, variables and initialization code to create the key pair that
// will be used by the proxy server to sign and verify tokens.

// The keys below will never expire, as they are pure keys, not certificates. But if you ever need
// to generate new ones (to change the key size to 4096 bits, for example) you can use the following
// command to first generate the private key:
//
//	$ openssl genrsa -out private.pem 4096
//
// That will generate a 'private.pem' file containing the private key. The public key can be
// generated from that, using the following command:
//
//	$ openssl rsa -in private.pem -pubout -out public.pem
//
// That will generate a 'public.pem' file containing the public key. Copy the content of those files
// and replace the text below.

package main

import (
	"crypto/rsa"
	"fmt"
	"os"

	"github.com/dgrijalva/jwt-go"
)

var (
	jwksPublicKey  *rsa.PublicKey
	jwksPrivateKey *rsa.PrivateKey
)

func init() {
	var err error
	jwksPublicKey, err = jwt.ParseRSAPublicKeyFromPEM([]byte(jwksPublicKeyPEM))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Can't parse JWKS public key: %v\n", err)
		os.Exit(1)
	}
	jwksPrivateKey, err = jwt.ParseRSAPrivateKeyFromPEM([]byte(jwksPrivateKeyPEM))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Can't parse JWKS private key: %v\n", err)
		os.Exit(1)
	}
}

const jwksPublicKeyPEM = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7bKPFZi7LJ5Oc/XefBDe
byQ1i38Sc3f7Jq0vh8aZC2W6SyqIlv3uUDWFozw0bdkS4MGN6eFjql0JIMIIoq/C
A3aNDCJXKFyVOepe7kgWQ5WY2HH03D/gzUM773TPIkeLCUDJhWi+KMcoMtyxgwr+
X4UVRz/o73fKMrv1bKq7ajAu2Wq1Cjp7zeoirnVz2uplpEtholrySyuhKFmjlRvg
eaLzlc/krB24+IPdJrklGyuwyr8jHDjYBJIsNuqtOzMibdhKPtAhswgZ/lyCFWt+
xAvLsVAJtfNwuED/Cac2KdY60tZzeWsknSuZKL76OARHxlPOWrMsw4jrqpkXM7Ns
LQIDAQAB
-----END PUBLIC KEY-----
`

const jwksPrivateKeyPEM = `
***REMOVED***
`
