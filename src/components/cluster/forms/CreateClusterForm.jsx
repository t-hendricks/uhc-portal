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
  Button, Icon, Form, Modal, Alert, HintBlock, Grid, Row, Col, Spinner,
} from 'patternfly-react';
import ReduxVerticalFormGroup from '../../clusters/ReduxVerticalFormGroup';
import CloudRegionComboBox from '../../clusters/CloudRegionComboBox';
import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clustersActions';
import validators from '../../../common/validators';
import ReduxCheckbox from '../../clusters/ReduxCheckbox';

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

  const loadingSpinner = () => (
    <div className="form-loading-spinner">
      <span>
      Do not refresh this page. This request may take a moment...
      </span>
      <Spinner size="xs" loading inline />
    </div>
  );

  return (
    <React.Fragment>
      <Modal.Header>
        <button type="button" className="close" aria-hidden="true" aria-label="Close" onClick={closeFunc}>
          <Icon type="pf" name="close" />
        </button>
        <Modal.Title>
          Create a Red Hat-Managed Cluster (OSD)
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {errorContainer}
          <Grid>
            <Row>
              <h3>Step 1: Cloud Provider Credentials</h3>
              <Col sm={5}>
                <Field
                  component={ReduxVerticalFormGroup}
                  name="aws_access_key_id"
                  label="AWS access key ID"
                  type="password"
                  placeholder="AWS access key ID"
                  validate={validators.required}
                  disabled={createClusterResponse.pending}
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="aws_secret_access_key"
                  label="AWS secret access key"
                  type="password"
                  placeholder="AWS secret access key"
                  validate={validators.required}
                  disabled={createClusterResponse.pending}
                />
              </Col>
              <Col sm={4}>
                <HintBlock
                  title="Need help setting up your credentials?"
                  style={{ marginTop: '20px' }}
                  body={(
                    <React.Fragment>
                      <p>
                        Some details to explain what an AWS access key is and how to create
                        an access key onthe AWS Platform.
                      </p>
                      <p>
                        A link to documentation showing how to configure the AWS account.
                      </p>
                    </React.Fragment>
                  )}
                />
              </Col>
            </Row>
            <Row>
              <h3>Step 2: Configuration</h3>
              <Col sm={5}>
                <Field
                  component={ReduxVerticalFormGroup}
                  name="name"
                  label="Cluster name"
                  type="text"
                  validate={validators.checkClusterName}
                  disabled={createClusterResponse.pending}
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="dns_base_domain"
                  label="Base DNS domain"
                  type="text"
                  validate={validators.checkBaseDNSDomain}
                  disabled={createClusterResponse.pending}
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="nodes_compute"
                  label="Compute nodes"
                  type="number"
                  min="1"
                  disabled={createClusterResponse.pending}
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="region"
                  label="AWS region"
                  componentClass={CloudRegionComboBox}
                  cloudProviderID="aws"
                  validate={validators.required}
                  disabled={createClusterResponse.pending}
                />
                <Field
                  component={ReduxCheckbox}
                  name="multi_az"
                  label="Deploy on multiple availability zones"
                  disabled={createClusterResponse.pending}
                />
              </Col>
              <Col sm={4}>
                <HintBlock
                  title="Basic Configuration"
                  body={(
                    <React.Fragment>
                      <p>
                        Your cluster name will be used for the cluster DNS name, so it must not
                        contain dots, underscores or special characters.
                      </p>
                      <p>
                        Some information on how to configure the base domain in AWS,
                        with link to documentation.
                      </p>
                    </React.Fragment>
                  )}
                />
                <HintBlock
                  title="Regions and Zones"
                  body={(
                    <React.Fragment>
                      <p>
                        You can select the geographical region for your cluster.
                        For some regions, it is possible to deploy the cluster on
                        multiple availability zones within the region, for high availability setups.
                      </p>
                      <p>
                        By default, the cluster is deployed on a single availability zone.
                      </p>
                    </React.Fragment>
                  )}
                />
              </Col>
            </Row>
          </Grid>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button bsStyle="primary" type="submit" onClick={handleSubmit} disabled={createClusterResponse.pending}>
          Create
        </Button>
        <Button bsStyle="default" onClick={closeFunc} disabled={createClusterResponse.pending}>
          Cancel
        </Button>
        {createClusterResponse.pending ? loadingSpinner() : null}
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
  createClusterResponse: state.clusters.createdCluster,
  initialValues: {
    name: '',
    nodes_compute: '4',
    dns_base_domain: '',
    aws_access_key_id: '',
    aws_secret_access_key: '',
    region: 'us-east-1',
    multi_az: false,
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
        compute: parseInt(formData.nodes_compute, 10),
      },
      dns: {
        base_domain: formData.dns_base_domain,
      },
      aws: {
        access_key_id: formData.aws_access_key_id,
        secret_access_key: formData.aws_secret_access_key,
      },
      multi_az: formData.multi_az,
    };
    dispatch(createCluster(clusterRequest));
  },
  resetResponse: () => dispatch(resetCreatedClusterResponse()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCreateCluster);
