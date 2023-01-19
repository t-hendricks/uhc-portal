import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ErrorBox from '../../../common/ErrorBox';

class ArchiveClusterDialog extends Component {
  componentDidUpdate() {
    const { archiveClusterResponse, resetResponse, closeModal, onClose } = this.props;
    if (archiveClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  render() {
    const {
      closeModal,
      submit,
      archiveClusterResponse,
      resetResponse,
      subscriptionID,
      name,
      shouldDisplayClusterName,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const error = archiveClusterResponse.error ? (
      <ErrorBox message="Error archiving cluster" response={archiveClusterResponse} />
    ) : null;

    return (
      <Modal
        title="Archive cluster"
        secondaryTitle={shouldDisplayClusterName ? name : undefined}
        data-testid="archive-cluster-dialog"
        onClose={cancelEdit}
        primaryText="Archive cluster"
        onPrimaryClick={() => submit(subscriptionID, name)}
        isPending={archiveClusterResponse.pending}
        onSecondaryClick={cancelEdit}
      >
        <>
          {error}
          <Form onSubmit={() => submit(subscriptionID, name)}>
            <p>
              Archiving a cluster will remove it from the cluster list and remove the cluster from
              subscription management.
            </p>
            <p>
              This action will not delete the cluster, only remove it from OpenShift Cluster
              Manager.&nbsp;
              <a
                href="https://access.redhat.com/articles/4397891"
                target="_blank"
                rel="noreferrer noopener"
              >
                Instructions
              </a>
              &nbsp;for deleting a cluster may be found in the knowledge base.
            </p>
          </Form>
        </>
      </Modal>
    );
  }
}

ArchiveClusterDialog.propTypes = {
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  resetResponse: PropTypes.func.isRequired,
  archiveClusterResponse: PropTypes.object,
  subscriptionID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  shouldDisplayClusterName: PropTypes.bool,
};

ArchiveClusterDialog.defaultProps = {
  archiveClusterResponse: {},
};

ArchiveClusterDialog.modalName = modals.ARCHIVE_CLUSTER;

export default ArchiveClusterDialog;
