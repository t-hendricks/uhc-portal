import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';

class UnarchiveClusterDialog extends Component {
  componentDidUpdate() {
    const {
      unarchiveClusterResponse, resetResponse, closeModal, onClose,
    } = this.props;
    if (unarchiveClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  render() {
    const {
      isOpen, closeModal, submit, unarchiveClusterResponse, resetResponse, subscriptionID, name,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const error = unarchiveClusterResponse.error ? (
      <ErrorBox message="Error un-archiving cluster" response={unarchiveClusterResponse} />
    ) : null;

    return isOpen && (
      <Modal
        title="Unarchive cluster"
        data-test-id="unarchive-cluster-dialog"
        onClose={cancelEdit}
        primaryText="Unarchive cluster"
        onPrimaryClick={() => submit(subscriptionID, name)}
        isPending={unarchiveClusterResponse.pending}
        onSecondaryClick={cancelEdit}
      >
        <>
          {error}
          <Form onSubmit={() => submit(subscriptionID, name)}>
            <p>
              Un-archiving a cluster will make it visible in the active (default) cluster list.
              You may need to manage subscriptions if the cluster is active.
            </p>
          </Form>
        </>
      </Modal>
    );
  }
}

UnarchiveClusterDialog.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  unarchiveClusterResponse: PropTypes.object,
  subscriptionID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

UnarchiveClusterDialog.defaultProps = {
  isOpen: false,
  unarchiveClusterResponse: {},
};

export default UnarchiveClusterDialog;
