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
import { Field } from 'redux-form';
import { Redirect } from 'react-router';
import {
  Modal, Button, Form, Alert, Grid, Row, Col, Spinner, ExpandCollapse,
} from 'patternfly-react';
import ReduxVerticalFormGroup from '../ReduxVerticalFormGroup';
import CloudRegionComboBox from '../CloudRegionComboBox';
import validators from '../../../common/validators';
import ReduxCheckbox from '../ReduxCheckbox';
import ModalHeader from '../../Modal/components/ModalHeader';
import constants, {
  AWSCredentialsHint, ConfigurationHint, RegionsHint, NetworkConfugurationHint,
} from './CreateClusterModalHelper';

function CreateClusterModal(props) {
  const {
    isOpen, closeModal, handleSubmit, createClusterResponse, resetResponse,
  } = props;

  if (createClusterResponse.fulfilled) {
    resetResponse();
    return (
      <Redirect to={`/cluster/${createClusterResponse.cluster.id}`} />
    );
  }

  const hasError = createClusterResponse.error && (
    <Alert>
      <span>{`Error creating cluster: ${createClusterResponse.errorMessage}`}</span>
    </Alert>);

  const loadingSpinner = () => (
    <div className="form-loading-spinner">
      <span>
        {constants.spinnerMessage}
      </span>
      <Spinner size="xs" loading inline />
    </div>
  );

  const onClose = () => {
    resetResponse();
    closeModal('create-cluster');
  };

  return isOpen
    && (
    <Modal show className="right-side-modal-pf" bsSize="large">
      <Modal.Header>
        <ModalHeader title="Create a Red Hat-Managed Cluster" onClose={onClose} />
      </Modal.Header>
      <Modal.Body>
        <Form>
          {hasError}
          <Grid>
            <Row>
              <h3>{constants.step1Header}</h3>
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
                <AWSCredentialsHint />
              </Col>
            </Row>
            <Row>
              <h3>{constants.step2Header}</h3>
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
                <ConfigurationHint />
                <RegionsHint />
              </Col>
            </Row>
            <Row>
              <ExpandCollapse>
                <Col sm={5}>
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="network_machine_cidr"
                    label="Machine CIDR"
                    type="text"
                    validate={validators.cidr}
                    disabled={createClusterResponse.pending}
                  />
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="network_service_cidr"
                    label="Service CIDR"
                    type="text"
                    validate={validators.cidr}
                    disabled={createClusterResponse.pending}
                  />
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="network_pod_cidr"
                    label="Pod CIDR"
                    type="text"
                    validate={validators.cidr}
                    disabled={createClusterResponse.pending}
                  />
                </Col>
                <Col sm={4}>
                  <NetworkConfugurationHint />
                </Col>
              </ExpandCollapse>
            </Row>
          </Grid>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" type="submit" onClick={handleSubmit} disabled={createClusterResponse.pending}>
          Create
        </Button>
        <Button bsStyle="default" onClick={onClose} disabled={createClusterResponse.pending}>
          Cancel
        </Button>
        {createClusterResponse.pending ? loadingSpinner() : null}
      </Modal.Footer>
    </Modal>
    );
}
CreateClusterModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createClusterResponse: PropTypes.object,
};

CreateClusterModal.defaultProps = {
  isOpen: false,
};

export default CreateClusterModal;
