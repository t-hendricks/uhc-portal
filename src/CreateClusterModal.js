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

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Button, Col, ControlLabel, HelpBlock, Icon, Form, FormGroup, Modal } from 'patternfly-react'

class CreateClusterModal extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
  }

  render() {
    var props = this.props;
    return (
      <Modal show={props.show}>
        <Modal.Header>
          <button className="close" onClick={() => alert('TODO close unimplemented')} aria-hidden="true" aria-label="Close">
            <Icon type="pf" name="close" />
          </button>
          <Modal.Title>Create Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form horizontal>
            <FormGroup controlId="name">
              <Col componentClass={ControlLabel} sm={3}>
                name
              </Col>
              <Col sm={9}>
                <Form.FormControl type="text" />
                <HelpBlock>Cluster name</HelpBlock>
              </Col>
            </FormGroup>
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={() => alert('TODO Create unimplemented')}>
            Create
          </Button>
          <Button bsStyle="default"  onClick={() => alert('TODO Cancel unimplemented')}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export { CreateClusterModal }
