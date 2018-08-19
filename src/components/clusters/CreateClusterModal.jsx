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
  Button, Icon, Form, Modal, Alert,
} from 'patternfly-react';
import ReduxHorizontalFormGroup from './ReduxHorizontalFormGroup';
import * as actions from '../../redux/actions/createCluster';
import postNewCluster from '../../apis/createCluster';
import ClusterCreationSuccessModal from './ClusterCreationSuccessModal';


// Validations
const required = value => (value ? undefined : 'Field is required');


function CreateClusterModal(props) {
  // handleSubmit comes from reduxForm()
  const {
    cancelTo, handleSubmit, createClusterResponse,
  } = props;
  let errorContainer = <div />;
  if (createClusterResponse.createCluster !== undefined) {
    const response = createClusterResponse.createCluster;
    if (response.error !== undefined) {
      errorContainer = (
        <Alert>
          <span>
            Error creating cluster:
          </span>
          <span>
            {response.error}
          </span>
        </Alert>
      );
    }
    if (response.state === 'Installing' || response.state === 'Ready') {
      return <ClusterCreationSuccessModal clusterID={response.id} closeTo={cancelTo} />;
    }
  }
  return (
    <Modal show>
      <Form horizontal onSubmit={handleSubmit}>

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
          {errorContainer}
          <Field
            component={ReduxHorizontalFormGroup}
            name="name"
            label="Cluster name"
            type="text"
            validate={required}
            helpText="TODO: what does this affect?"
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="nodes_master"
            label="Master nodes"
            type="number"
            min="1"
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="nodes_infra"
            label="Infra nodes"
            type="number"
            min="2"
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="nodes_compute"
            label="Compute nodes"
            type="number"
            min="1"
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="aws_access_key_id"
            label="AWS access key ID"
            type="password"
            placeholder="AWS access key ID"
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="aws_secret_access_key"
            label="AWS secret access key"
            type="password"
            placeholder="AWS secret access key"
            helpText="Do NOT put here your AWS user/password.  You should create an AWS IAM sub-user, generate an access key for Red Hat, and put that here."
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="region"
            label="AWS region"
            componentClass="select"
            helpText="TODO support other regions"
          >
            <option value="us-east-1">
              us-east-1
            </option>
          </Field>

          <Field
            component={ReduxHorizontalFormGroup}
            name="availability_zone"
            label="AWS availability zone"
            componentClass="select"
            helpText="TODO unused"
          >
            <option value="us-east-1a">
              us-east-1a
            </option>
          </Field>

        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" type="submit">
            Create
          </Button>
          <Link to={cancelTo}>
            <Button bsStyle="default">
              Cancel
            </Button>
          </Link>
        </Modal.Footer>

      </Form>
    </Modal>
  );
}
CreateClusterModal.propTypes = {
  cancelTo: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createClusterResponse: PropTypes.object,
};

const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateClusterModal = reduxForm(reduxFormConfig)(CreateClusterModal);

const mapStateToProps = state => ({
  createClusterResponse: state.createCluster,
  initialValues: {
    name: '',
    nodes_master: '1',
    nodes_infra: '2',
    nodes_compute: '4',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    region: 'us-east-1',
    availability_zone: 'us-east-1a',
  },
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    dispatch(actions.createClusterRequest());

    const cluster = {
      name: formData.name,
      region: formData.region,
      nodes: {
        master: parseInt(formData.nodes_master, 10),
        infra: parseInt(formData.nodes_infra, 10),
        compute: parseInt(formData.nodes_compute, 10),
      },
    };
    postNewCluster(cluster)
      .then(response => response.json())
      .then((value) => {
        dispatch(actions.createClusterResponse(value));
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateClusterModal);
