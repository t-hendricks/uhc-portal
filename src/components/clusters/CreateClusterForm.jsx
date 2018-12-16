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
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router';
import {
  Button, Icon, Form, Modal, Alert, HintBlock,
} from 'patternfly-react';
import ReduxHorizontalFormGroup from './ReduxHorizontalFormGroup';
import { createCluster, resetCreatedClusterResponse } from '../../redux/actions/clusterActions';

// Function to validate that a field is mandatory:
const required = value => (value ? undefined : 'Field is required');

// Valid RFC-1035 labels must consist of lower case alphanumeric characters or '-', start with an
// alphabetic character, and end with an alphanumeric character (e.g. 'my-name',  or 'abc-123').
const dnsLabelRE = /^[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Function to validate that the cluster name field contains a valid DNS label:
function checkClusterName(value) {
  if (!value) {
    return 'Cluster name is required.';
  }
  if (!dnsLabelRE.test(value)) {
    return `Cluster name '${value}' isn't valid, must consist of lower-case alphanumeric characters or '-', start with an alphabetic character, and end with an alphanumeric character. For example, 'my-name', or 'abc-123'.`;
  }
  return undefined;
}

// Regular expression used to check base DNS domains, based on RFC-1035
const baseDomainRE = /^([a-z]([-a-z0-9]*[a-z0-9])?\.)+[a-z]([-a-z0-9]*[a-z0-9])?$/;

// Function to validate that a field contains a correct base DNS domain
function checkBaseDNSDomain(value) {
  if (!value) {
    return 'Base DNS domain is required.';
  }
  if (!baseDomainRE.test(value)) {
    return `Base DNS domain '${value}' isn't valid, must contain at least two valid lower-case DNS labels separated by dots, for example 'mydomain.com'.`;
  }
  return undefined;
}

function CreateClusterForm(props) {
  // handleSubmit comes from reduxForm()
  const {
    closeFunc, handleSubmit, createClusterResponse, resetResponse,
  } = props;

  if (createClusterResponse.fulfilled) {
    resetResponse();
    return (
      <Redirect to={`/cluster/${createClusterResponse.cluster.id}`} />
    );
  }

  let errorContainer = <div />;
  if (createClusterResponse.error) {
    errorContainer = (
      <Alert>
        <span>
          Error creating cluster:
        </span>
        <span>
          {createClusterResponse.error}
        </span>
        <span>
          {createClusterResponse.errorMessage}
        </span>
      </Alert>
    );
  }
  return (
    <React.Fragment>
      <Modal.Header>
        <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={closeFunc}>
          <Icon type="pf" name="close" />
        </button>
        <Modal.Title>
          Create Cluster
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form horizontal onSubmit={handleSubmit}>
          {errorContainer}
          <HintBlock
            title="Note"
            body="At the moment, clusters created here can only be deleted via the API."
          />
          <Field
            component={ReduxHorizontalFormGroup}
            name="name"
            label="Cluster name"
            type="text"
            validate={checkClusterName}
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
            name="dns_base_domain"
            label="Base DNS domain"
            type="text"
            validate={checkBaseDNSDomain}
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="aws_access_key_id"
            label="AWS access key ID"
            type="password"
            placeholder="AWS access key ID"
            validate={required}
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="aws_secret_access_key"
            label="AWS secret access key"
            type="password"
            placeholder="AWS secret access key"
            helpText="Do NOT put here your AWS user/password.  You should create an AWS IAM sub-user, generate an access key for Red Hat, and put that here."
            validate={required}
          />

          <Field
            component={ReduxHorizontalFormGroup}
            name="region"
            label="AWS region"
            componentClass="select"
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
          >
            <option value="us-east-1a">
              us-east-1a
            </option>
          </Field>

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button bsStyle="primary" type="submit">
          Create
        </Button>
        <Button bsStyle="default" onClick={closeFunc}>
          Cancel
        </Button>
      </Modal.Footer>
    </React.Fragment>
  );
}
CreateClusterForm.propTypes = {
  closeFunc: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createClusterResponse: PropTypes.object,
};

const reduxFormConfig = {
  form: 'CreateCluster',
};
const reduxFormCreateCluster = reduxForm(reduxFormConfig)(CreateClusterForm);

const mapStateToProps = state => ({
  createClusterResponse: state.cluster.createdCluster,
  initialValues: {
    name: '',
    nodes_master: '1',
    nodes_infra: '2',
    nodes_compute: '4',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    region: 'us-east-1',
    availability_zone: 'us-east-1a',
  },
});

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    const clusterRequest = {
      name: formData.name,
      region: {
        id: formData.region,
      },
      flavour: {
        id: '4',
      },
      nodes: {
        master: parseInt(formData.nodes_master, 10),
        infra: parseInt(formData.nodes_infra, 10),
        compute: parseInt(formData.nodes_compute, 10),
      },
      dns: {
        base_domain: formData.dns_base_domain,
      },
      aws: {
        access_key_id: formData.aws_access_key_id,
        secret_access_key: formData.aws_secret_access_key,
      },
    };
    dispatch(createCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
