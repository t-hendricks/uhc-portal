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
  Button, Icon, Form, Modal, Alert, HintBlock, Grid, Row, Col,
} from 'patternfly-react';
import ReduxVerticalFormGroup from '../ReduxVerticalFormGroup';
import CloudRegionComboBox from '../CloudRegionComboBox';
import { createCluster, resetCreatedClusterResponse } from '../../../redux/actions/clusterActions';
import validators from '../../../common/validators';

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
          Create a Red Hat-Managed Cluster (OSD)
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form horizontal>
          {errorContainer}
          {/* This HintBlock was requested by KB,
            please don't remove until we implement the deletion dialog */}
          <HintBlock
            title="Note"
            body="At the moment, clusters created here can only be deleted via the API."
            className="create-cluster-hint"
          />
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
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="aws_secret_access_key"
                  label="AWS secret access key"
                  type="password"
                  placeholder="AWS secret access key"
                  validate={validators.required}
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
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="dns_base_domain"
                  label="Base DNS domain"
                  type="text"
                  validate={validators.checkBaseDNSDomain}
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="nodes_master"
                  label="Master nodes"
                  type="number"
                  min="1"
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="nodes_infra"
                  label="Infra nodes"
                  type="number"
                  min="2"
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="nodes_compute"
                  label="Compute nodes"
                  type="number"
                  min="1"
                />

                <Field
                  component={ReduxVerticalFormGroup}
                  name="region"
                  label="AWS region"
                  componentClass={CloudRegionComboBox}
                  cloudProviderID="aws"
                  validate={validators.required}
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
        <Button bsStyle="primary" type="submit" onClick={handleSubmit}>
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
    availability_zone: 'us-east-1a', // Note, this should be removed from the API, but is here for backwards compatibility
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
