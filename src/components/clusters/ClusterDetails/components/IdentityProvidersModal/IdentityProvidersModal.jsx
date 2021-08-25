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
    const { submitIDPResponse, getClusterIdentityProviders } = this.props;
    if (submitIDPResponse.fulfilled) {
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
      isOpen,
      handleSubmit,
      submitIDPResponse,
      clusterName,
      selectedIDP,
      selectedMappingMethod,
      change,
      IDPList,
      clusterConsoleURL,
      initialValues,
      idpEdited,
      isEditForm,
      anyTouched,
      invalid,
      HTPasswdPasswordErrors,
    } = this.props;

    const isPending = submitIDPResponse.pending;

    return isOpen
    && (
    <Modal
      variant="large"
      onClose={() => this.onClose()}
      title={isEditForm ? `Edit identity provider (${clusterName})` : `Create identity provider (${clusterName})`}
      isPending={isPending}
      onPrimaryClick={handleSubmit}
      isPrimaryDisabled={!anyTouched || invalid}
      onSecondaryClick={() => this.onClose()}
      data-test-id="add-idp-osd-dialog"
    >
      <IDPForm
        selectedIDP={selectedIDP}
        submitIDPResponse={submitIDPResponse}
        selectedMappingMethod={selectedMappingMethod}
        clusterConsoleURL={clusterConsoleURL}
        change={change}
        IDPList={IDPList}
        isEditForm={isEditForm}
        idpEdited={idpEdited}
        idpName={initialValues.name}
        HTPasswdPasswordErrors={HTPasswdPasswordErrors}
      />
    </Modal>
    );
  }
}

IdentityProvidersModal.propTypes = {
  clusterName: PropTypes.string,
  clusterConsoleURL: PropTypes.string,
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitIDPResponse: PropTypes.object,
  getClusterIdentityProviders: PropTypes.func,
  selectedIDP: PropTypes.string,
  selectedMappingMethod: PropTypes.string,
  refreshParent: PropTypes.func,
  change: PropTypes.func.isRequired,
  IDPList: PropTypes.array.isRequired,
  idpEdited: PropTypes.object,
  isEditForm: PropTypes.bool,
  initialValues: PropTypes.shape({
    idpId: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  anyTouched: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  HTPasswdPasswordErrors: PropTypes.object,
};

IdentityProvidersModal.defaultProps = {
  clusterName: '',
  isOpen: false,
  selectedIDP: 'GithubIdentityProvider',
};

export default IdentityProvidersModal;
