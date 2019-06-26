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
import { Modal, Button, Spinner } from 'patternfly-react';

import ModalHeader from '../../../../common/Modal/components/ModalHeader';

import IDPForm from './components/IDPForm';

class IdentityProvidersModal extends React.Component {
  componentDidUpdate() {
    const { createIDPResponse, getClusterIdentityProviders } = this.props;
    if (createIDPResponse.fulfilled) {
      this.onClose();
      getClusterIdentityProviders();
    }
  }

  onClose = () => {
    const {
      resetResponse, resetForm, closeModal, onClose,
    } = this.props;
    resetResponse();
    resetForm();
    closeModal();
    onClose();
  };

  render() {
    const {
      isOpen, handleSubmit, createIDPResponse, clusterName, selectedIDP,
    } = this.props;

    const isPending = createIDPResponse.pending;

    const LoadingSpinner = () => (
      <div className="form-loading-spinner">
        <span>Please wait...</span>
        <Spinner size="xs" loading inline />
      </div>
    );

    return isOpen
    && (
    <Modal show className="right-side-modal-pf" bsSize="large" onHide={this.onClose}>
      <Modal.Header>
        <ModalHeader title={`Create Identity Provider (${clusterName})`} onClose={this.onClose} />
      </Modal.Header>
      <Modal.Body>
        <IDPForm selectedIDP={selectedIDP} createIDPResponse={createIDPResponse} />
      </Modal.Body>
      <Modal.Footer>
        <Button bsStyle="primary" type="submit" onClick={handleSubmit} disabled={isPending}>
          Create
        </Button>
        <Button bsStyle="default" onClick={this.onClose} disabled={isPending}>
          Cancel
        </Button>
        {isPending ? <LoadingSpinner /> : null}
      </Modal.Footer>
    </Modal>
    );
  }
}

IdentityProvidersModal.propTypes = {
  clusterName: PropTypes.string,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  createIDPResponse: PropTypes.object,
  getClusterIdentityProviders: PropTypes.func,
  selectedIDP: PropTypes.string,
  onClose: PropTypes.func,
};

IdentityProvidersModal.defaultProps = {
  clusterName: '',
  isOpen: false,
  selectedIDP: 'GithubIdentityProvider',
};

export default IdentityProvidersModal;
