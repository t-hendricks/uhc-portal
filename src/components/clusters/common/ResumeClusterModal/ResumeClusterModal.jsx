import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { Form } from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import modals from '../../../common/Modal/modals';
import ErrorBox from '../../../common/ErrorBox';

class ResumeClusterModal extends Component {
  componentDidUpdate() {
    const { resumeClusterResponse, resetResponse, closeModal, onClose } = this.props;
    if (resumeClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  render() {
    const {
      closeModal,
      submit,
      resumeClusterResponse,
      resetResponse,
      clusterID,
      clusterName,
      shouldDisplayClusterName,
    } = this.props;

    const cancelResumeCluster = () => {
      resetResponse();
      closeModal();
    };

    const error = resumeClusterResponse.error ? (
      <ErrorBox message="Error hibernating cluster" response={resumeClusterResponse} />
    ) : null;

    const handleSubmit = () => {
      submit(clusterID);
    };

    return (
      <Modal
        data-testid="resume-cluster-modal"
        title="Resume from Hibernation"
        secondaryTitle={shouldDisplayClusterName ? clusterName : undefined}
        onClose={cancelResumeCluster}
        primaryText="Resume cluster"
        secondaryText="Cancel"
        onPrimaryClick={handleSubmit}
        isPending={resumeClusterResponse.pending}
        onSecondaryClick={cancelResumeCluster}
      >
        <>
          <Form onSubmit={() => handleSubmit()}>
            {error}
            <p>
              cluster will move out of Hibernating state and all cluster operations will be resumed.
            </p>
          </Form>
        </>
      </Modal>
    );
  }
}

ResumeClusterModal.propTypes = {
  clusterID: PropTypes.string.isRequired,
  clusterName: PropTypes.string.isRequired,
  closeModal: PropTypes.func,
  resetResponse: PropTypes.func,
  resumeClusterResponse: PropTypes.shape({
    fulfilled: PropTypes.bool,
    pending: PropTypes.bool,
    error: PropTypes.bool,
  }),
  submit: PropTypes.func,
  onClose: PropTypes.func,
  shouldDisplayClusterName: PropTypes.bool,
};

ResumeClusterModal.defaultProps = {
  resumeClusterResponse: {},
};

ResumeClusterModal.modalName = modals.RESUME_CLUSTER;

export default ResumeClusterModal;
