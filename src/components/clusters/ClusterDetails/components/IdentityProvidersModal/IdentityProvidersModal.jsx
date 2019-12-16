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

import Modal from '../../../../common/Modal/Modal';

import IDPForm from './components/IDPForm';

class IdentityProvidersModal extends React.Component {
  componentDidUpdate() {
    const { createIDPResponse, getClusterIdentityProviders } = this.props;
    if (createIDPResponse.fulfilled) {
      this.onClose(true);
      getClusterIdentityProviders();
    }
  }

  onClose = (refresh) => {
    const {
      resetResponse, resetForm, closeModal, refreshParent,
    } = this.props;
    resetResponse();
    resetForm();
    closeModal();
    if (refresh && refreshParent !== undefined) {
      refreshParent();
    }
  };

  render() {
    const {
      isOpen, handleSubmit, createIDPResponse, clusterName, selectedIDP, selectedMappingMethod,
    } = this.props;

    const isPending = createIDPResponse.pending;

    return isOpen
    && (
    <Modal
      isLarge
      onClose={() => this.onClose()}
      title={`Create Identity Provider (${clusterName})`}
      isPending={isPending}
      onPrimaryClick={handleSubmit}
      onSecondaryClick={() => this.onClose()}
    >
      <IDPForm
        selectedIDP={selectedIDP}
        createIDPResponse={createIDPResponse}
        selectedMappingMethod={selectedMappingMethod}
      />
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
  selectedMappingMethod: PropTypes.string,
  refreshParent: PropTypes.func,
};

IdentityProvidersModal.defaultProps = {
  clusterName: '',
  isOpen: false,
  selectedIDP: 'GithubIdentityProvider',
};

export default IdentityProvidersModal;
