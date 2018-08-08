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
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import {
  Button, Col, ControlLabel, HelpBlock, Icon, Form, FormControl, FormGroup, Modal,
} from 'patternfly-react';
import * as actions from './ducks/createcluster';
import * as api from './apis/createCluster';

const labelCols = 3;
const fieldCols = 12 - labelCols;

// To be used inside redux-form Field component.
function ReduxFormGroup(props) {
  console.log(props);

  const {
    label,
    helpText,
    meta: { error, warning, touched },
    input,
    ...extraProps,
  } = props;

  return (
    <FormGroup controlId={input.name} validationState={touched && error ? "error" : null}>
      <Col componentClass={ControlLabel} sm={labelCols}>
        {label}
      </Col>
      <Col sm={fieldCols}>
        <FormControl name={input.name} {...input} {...extraProps}/>
        <HelpBlock>
          {touched && error ? `${helpText} ${error}` : helpText}
        </HelpBlock>
      </Col>
    </FormGroup>
  );
}
ReduxFormGroup.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  // props passed by redux-form
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  // plus other props to be passed to the field...
};

// Validations
const required = value => (value ? undefined : "Field is required");

function CreateClusterModal(props) {
  const { cancelTo, createCluster } = props;

  const submit = () => {
    // TODO use form content here
    const cluster = {
      name: 'nimrods_cluster',
      region: 'us-east-1',
      nodes: {
        master: 1,
        infra: 2,
        compute: 4,
      },
      memory: {
        total: 400,
      },
      cpu: {
        total: 16,
      },
      storage: {
        total: 72,
      },
    };
    createCluster(cluster);
  };

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

          <Field
            component={ReduxFormGroup}
            name="name"
            label="Cluster name"
            type="text"
            validate={required}
            helpText="TODO: what does this affect?"
            />

          <Field
            component={ReduxFormGroup}
            name="aws_access_key_id"
            label="AWS access key ID"
            type="password"
            placeholder="AWS access key ID"
            />

          <Field
            component={ReduxFormGroup}
            name="aws_secret_access_key"
            label="AWS secret access key"
            type="password"
            placeholder="AWS secret access key"
            helpText="Do NOT put here your AWS user/password.  You should create an AWS IAM sub-user, generate an access key for Red Hat, and put that here."
            />

          <Field
            component={ReduxFormGroup}
            name="region"
            label="AWS region"
            componentClass="select"
            placeholder="us-east-1"
            helpText="TODO support other regions"
            >
            <option value="us-east-1">
              us-east-1
            </option>
          </Field>

          <Field
            component={ReduxFormGroup}
            name="availability_zone"
            label="AWS availability zone"
            componentClass="select"
            placeholder="us-east-1a"
            helpText="TODO unused"
            >
            <option value="us-east-1a">
              us-east-1a
            </option>
          </Field>

        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" onClick={submit}>
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
  createCluster: PropTypes.func.isRequired,
};

const reduxFormCreateClusterModal = reduxForm({form: 'CreateCluster'})(CreateClusterModal)

const mapStateToProps = state => ({
  // TODO connect form content to state
});

const mapDispatchToProps = dispatch => ({
  createCluster: (cluster) => {
    dispatch(actions.createClusterRequest());
    api.postNewCluster(cluster)
      .then(response => response.json())
      .then((value) => {
        dispatch(actions.createClusterResponse(value));
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateClusterModal);
