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

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button, Col, ControlLabel, HelpBlock, Icon, Form, FormControl, FormGroup, Modal,
} from 'patternfly-react';

function CreateClusterModal(props) {
  const { cancelTo } = props;
  return (
    <Modal show>
      <Modal.Header>
        <Link to={cancelTo}>
          <button type="button" className="close" aria-hidden="true" aria-label="Close">
            <Icon type="pf" name="close" />
          </button>
        </Link>
        <Modal.Title>
Create Cluster
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form horizontal>
          <FormGroup controlId="name">
            <Col componentClass={ControlLabel} sm={3}>
                Cluster name
            </Col>
            <Col sm={9}>
              <Form.FormControl type="text" />
              <HelpBlock>
TODO: what does this affect?
              </HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup controlId="aws_access_key_id">
            <Col componentClass={ControlLabel} sm={3}>
                AWS access key ID
            </Col>
            <Col sm={9}>
              <Form.FormControl type="password" placeholder="AWS access key ID" />
            </Col>
          </FormGroup>

          <FormGroup controlId="aws_secret_access_key">
            <Col componentClass={ControlLabel} sm={3}>
                AWS secret access key
            </Col>
            <Col sm={9}>
              <Form.FormControl type="password" placeholder="AWS secret access key" />
              <HelpBlock>
Do NOT put here your AWS user/password.  You should create an AWS IAM sub-user, generate an access key for Red Hat, and put that here.
              </HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup controlId="region">
            <Col componentClass={ControlLabel} sm={3}>
                AWS region
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="us-east-1">
                <option value="us-east-1">
us-east-1
                </option>
              </FormControl>
              <HelpBlock>
TODO support other regions
              </HelpBlock>
            </Col>
          </FormGroup>

          <FormGroup controlId="availability_zone">
            <Col componentClass={ControlLabel} sm={3}>
                AWS availability zone
            </Col>
            <Col sm={9}>
              <FormControl componentClass="select" placeholder="us-east-1a">
                <option value="us-east-1a">
us-east-1a
                </option>
              </FormControl>
              <HelpBlock>
TODO unused
              </HelpBlock>
            </Col>
          </FormGroup>

        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" onClick={() => alert('TODO Create unimplemented')}>
            Create
        </Button>
        <Link to={cancelTo}>
          <Button bsStyle="default">
              Cancel
          </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
CreateClusterModal.propTypes = {
  cancelTo: PropTypes.string.isRequired,
  createTo: PropTypes.string.isRequired,
};

export default CreateClusterModal;
