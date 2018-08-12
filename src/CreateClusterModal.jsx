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
  Button, Icon, Form, Modal,
} from 'patternfly-react';
import ReduxHorizontalFormGroup from './components/ReduxHorizontalFormGroup';
import * as actions from './ducks/createcluster';
import * as api from './apis/createCluster';


// Validations
const required = value => (value ? undefined : 'Field is required');

function CreateClusterModal(props) {
  // handleSubmit comes from reduxForm()
  const { cancelTo, handleSubmit } = props;

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
            placeholder="us-east-1"
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
            placeholder="us-east-1a"
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
  createTo: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

const reduxFormConfig = {
  form: 'CreateCluster',
  //onSubmit:
}
const reduxFormCreateClusterModal = reduxForm(reduxFormConfig)(CreateClusterModal);

const mapStateToProps = state => ({
  // TODO connect form content to state
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formData) => {
    dispatch(actions.createClusterRequest());

    const cluster = {
      // TODO use more form content here
      name: formData.name,
      region: 'us-east-1',
      nodes: {
        master: 1,
        infra: 2,
        compute: 4,
      },
    };
    api.postNewCluster(cluster)
      .then(response => response.json())
      .then((value) => {
        dispatch(actions.createClusterResponse(value));
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateClusterModal);
