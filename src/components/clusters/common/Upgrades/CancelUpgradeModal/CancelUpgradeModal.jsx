import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

import Modal from '../../../../common/Modal/Modal';
import ErrorBox from '../../../../common/ErrorBox';

class CancelUpgradeModal extends React.Component {
  componentDidUpdate() {
    const { deleteScheduleRequest } = this.props;
    if (deleteScheduleRequest.fulfilled) {
      this.close();
    }
  }

  close = () => {
    const { clearDeleteScheduleResponse, closeModal } = this.props;
    clearDeleteScheduleResponse();
    closeModal();
  };

  deleteSchedule = () => {
    const { schedule, deleteSchedule, isHypershift } = this.props;
    deleteSchedule(schedule.cluster_id, schedule.id, isHypershift);
  };

  render() {
    const { isOpen, deleteScheduleRequest, schedule } = this.props;

    const error = deleteScheduleRequest.error ? (
      <ErrorBox message="Error cancelling update" response={deleteScheduleRequest} />
    ) : null;

    return (
      isOpen && (
        <Modal
          title="Cancel update"
          onClose={this.close}
          primaryText="Cancel this update"
          secondaryText="Close"
          onPrimaryClick={this.deleteSchedule}
          isPending={deleteScheduleRequest.pending}
          onSecondaryClick={this.close}
        >
          <>
            {error}
            <Form onSubmit={this.deleteSchedule}>
              <p>
                This update to version {schedule.version} is scheduled for{' '}
                <DateFormat type="exact" date={Date.parse(schedule.next_run)} />.{' '}
              </p>
            </Form>
          </>
        </Modal>
      )
    );
  }
}

CancelUpgradeModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
  deleteScheduleRequest: PropTypes.object,
  schedule: PropTypes.shape({
    id: PropTypes.string,
    cluster_id: PropTypes.string,
    next_run: PropTypes.string,
    version: PropTypes.string,
  }),
  clearDeleteScheduleResponse: PropTypes.func.isRequired,
  isHypershift: PropTypes.bool.isRequired,
};

export default CancelUpgradeModal;
