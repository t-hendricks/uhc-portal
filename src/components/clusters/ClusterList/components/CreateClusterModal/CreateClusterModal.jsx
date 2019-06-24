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
import { Redirect } from 'react-router';
import {
  Modal, Form, Button, Alert, Spinner,
} from 'patternfly-react';

import ModalHeader from '../../../../common/Modal/components/ModalHeader';
import constants from './CreateClusterModalHelper';
import ManagedClusterForm from './ManagedClusterForm';

function CreateClusterModal(props) {
  const {
    isOpen, closeModal, handleSubmit, createClusterResponse, resetResponse, resetForm, touch,
  } = props;

  const onClose = () => {
    resetResponse();
    resetForm();
    closeModal('create-cluster');
  };

  if (createClusterResponse.fulfilled) {
    onClose();
    return (
      <Redirect to={`/details/${createClusterResponse.cluster.id}`} />
    );
  }

  const hasError = createClusterResponse.error && (
    <Alert>
      <span>{`Error creating cluster: ${createClusterResponse.errorMessage}`}</span>
    </Alert>
  );

  const loadingSpinner = () => (
    <div className="form-loading-spinner">
      <span>
        {constants.spinnerMessage}
      </span>
      <Spinner size="xs" loading inline />
    </div>
  );

  const formProps = { pending: createClusterResponse.pending };

  return isOpen
    && (
    <Modal show className="right-side-modal-pf" bsSize="large" onHide={onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header>
          <ModalHeader title="Create a Red Hat-Managed Cluster" onClose={onClose} />
        </Modal.Header>
        <Modal.Body>
          {hasError}
          <ManagedClusterForm {...formProps} touch={touch} />
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
      </Form>
    </Modal>
    );
}
CreateClusterModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createClusterResponse: PropTypes.object,
  touch: PropTypes.func.isRequired,
};

CreateClusterModal.defaultProps = {
  isOpen: false,
};

export default CreateClusterModal;
