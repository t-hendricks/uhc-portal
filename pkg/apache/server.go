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

// Package apache contains the object that know how to start an Apache web server with a
// configuration generated from a template.
package apache

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"text/template"

	"github.com/golang/glog"
)

// Builder contains the configuration needed to create an Apache web server. Don't create instances
// of this type directly, use the NewBuilder method instead.
type Builder struct {
	template  string
	variables map[string]interface{}
}

// Server is an Apache web server.
type Server struct {
	root string
	cmd  *exec.Cmd
}

// NewBuilder creates a new object that can be used to create an Apache web server.
func NewBuilder() *Builder {
	builder := new(Builder)
	return builder
}

// Template sets the template that will be used to generate the configuration of the Apache web
// server. This template can contain any Apache configuration directive, except ServerRoot and
// PidFile, as these are set internally.
func (b *Builder) Template(value string) *Builder {
	b.template = value
	return b
}

// Variable sets the value of a variable that is used in the template.
func (b *Builder) Variable(name string, value interface{}) *Builder {
	if b.variables == nil {
		b.variables = make(map[string]interface{})
	}
	b.variables[name] = value
	return b
}

// Build creates a new Apache web server using the configuration stored in the builder.
func (b *Builder) Build() (server *Server, err error) {
	// Check mandatory parameters:
	if b.template == "" {
		err = fmt.Errorf("the template parameter is mandatory")
		return
	}

	// Compile the configuration template:
	confSource := confProlog + b.template
	confTemplate, err := template.New("httpd.conf").Parse(confSource)
	if err != nil {
		err = fmt.Errorf("can't parse 'httpd.conf' template: %v", err)
		return
	}

	// Create a temporary directory for the root of the web server:
	rootDir, err := ioutil.TempDir("", "apache.")
	if err != nil {
		err = fmt.Errorf("can't create temporary root directory: %v", err)
		return
	}
	glog.Infof("Temporary root directory is '%s'", rootDir)

	// Create other directories needed inside the root:
	confDir := filepath.Join(rootDir, "conf")
	err = os.Mkdir(confDir, 0700)
	if err != nil {
		err = fmt.Errorf("can't create configuration directory '%s': %v", confDir, err)
		return
	}
	glog.Infof("Temporary configuration directory is '%s'", confDir)
	runDir := filepath.Join(rootDir, "run")
	err = os.Mkdir(runDir, 0700)
	if err != nil {
		err = fmt.Errorf("can't create state directory '%s': %v", runDir, err)
		return
	}
	glog.Infof("Temporary state directory '%s'", runDir)

	// Populate the data that will be passsed to the template to generate the 'httpd.conf' file:
	confVariables := map[string]interface{}{
		"ConfDir": confDir,
		"RootDir": rootDir,
		"RunDir":  runDir,
	}
	for name, value := range b.variables {
		confVariables[name] = value
	}

	// Process the 'httpd.conf' template and write the result to the buffer:
	confBuffer := new(bytes.Buffer)
	err = confTemplate.Execute(confBuffer, confVariables)
	if err != nil {
		err = fmt.Errorf("can't execute configuration template: %v", err)
		return
	}
	confText := confBuffer.String()
	glog.Infof("Generated configuration text follows\n%s\n", confText)

	// Write the 'httpd.conf' file:
	confPath := filepath.Join(confDir, "httpd.conf")
	glog.Infof("Writing generated configuration text to file '%s", confPath)
	confFile, err := os.Create(confPath)
	if err != nil {
		err = fmt.Errorf("can't create configuration file '%s': %v", confPath, err)
		return
	}
	_, err = confBuffer.WriteTo(confFile)
	if err != nil {
		err = fmt.Errorf("can't write configuration file '%s': %v", confPath, err)
		return
	}

	// Create and populate the server:
	server = new(Server)
	server.root = rootDir

	return
}

// Start starts the Apache web server. Returns inmediately once the process is started.
func (s *Server) Start() error {
	// Check that the server hasn't already been started:
	if s.cmd != nil {
		return fmt.Errorf(
			"the server has already been started, PID is %d",
			s.cmd.Process.Pid,
		)
	}

	// Start the web server process:
	bin := "/usr/sbin/httpd"
	args := []string{
		"-d", s.root,
		"-D", "FOREGROUND",
	}
	glog.Infof(
		"Starting web server with binary '%s' and arguments '%s'",
		bin, strings.Join(args, " "),
	)
	// #nosec G204
	cmd := exec.Command(bin, args...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err := cmd.Start()
	if err != nil {
		return fmt.Errorf("can't start the web server: %v", err)
	}
	s.cmd = cmd

	return nil
}

// Stop stops the Apache web server.
func (s *Server) Stop() error {
	// Send the terminate signal to the server:
	err := syscall.Kill(s.cmd.Process.Pid, syscall.SIGTERM)
	if err != nil {
		return fmt.Errorf(
			"can't send signal %d to the web server PID %d: %v",
			syscall.SIGTERM, s.cmd.Process.Pid, err,
		)
	}

	// Wait for the process to finish:
	err = s.cmd.Wait()
	if err != nil {
		return fmt.Errorf(
			"can't wait for web server PID %d to finish: %v",
			s.cmd.Process.Pid, err,
		)
	}

	// Remote the temporary root directory:
	glog.Infof("Removing temporary root directory '%s'", s.root)
	err = os.RemoveAll(s.root)
	if err != nil {
		return fmt.Errorf(
			"can't remove temporary root directory '%s': %v",
			s.root, err,
		)
	}

	return nil
}

// confProlog is added at the begin of the generated configuration file.
const confProlog = `
# Set the server root:
ServerRoot {{ .RootDir }}

# The default location of the PID file isn't readable by the user that
# runs the container, so we need to put it in a different place:
PidFile {{ .RunDir }}/httpd.pid
`
