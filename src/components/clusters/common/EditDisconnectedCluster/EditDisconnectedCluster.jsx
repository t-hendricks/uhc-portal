import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'redux-form';
import {
  Form,
} from '@patternfly/react-core';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';
import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import {
  required,
  checkDisconnectedSockets,
  checkDisconnectedvCPU,
  checkDisconnectedMemCapacity,
  checkDisconnectedNodeCount,
} from '../../../../common/validators';

class EditDisconnectedClusterDialog extends Component {
  componentDidUpdate(prevProps) {
    const {
      initialFormValues,
      change,
      editClusterResponse,
      resetResponse,
      closeModal,
      onClose,
    } = this.props;

    if (initialFormValues.id) {
      if (prevProps.initialFormValues.id !== initialFormValues.id) {
        const fields = ['id', 'sockets', 'vCPUs', 'memoryCapacity', 'computeNodes'];
        fields.forEach(field => change(field, initialFormValues[field]));
      }
    }

    if (editClusterResponse.fulfilled) {
      resetResponse();
      closeModal();
      onClose();
    }
  }

  render() {
    const {
      isOpen,
      closeModal,
      handleSubmit,
      editClusterResponse,
      resetResponse,
      systemType,
    } = this.props;

    const cancelEdit = () => {
      resetResponse();
      closeModal();
    };

    const error = editClusterResponse.error ? (
      <ErrorBox message="Error editing cluster" response={editClusterResponse} />
    ) : null;

    return isOpen && (
      <Modal
        title="Edit cluster registration"
        primaryText="Save"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={cancelEdit}
        onClose={cancelEdit}
        isPending={editClusterResponse.pending}
      >
        { error }
        <Form>
          {systemType === 'physical' && (
          <Field
            component={ReduxVerticalFormGroup}
            label="Number of sockets or LPARs"
            name="sockets"
            inputMode="numeric"
            disabled={editClusterResponse.pending}
            validate={[required, checkDisconnectedSockets]}
            isRequired
          />
          )}
          {systemType === 'virtual' && (
          <Field
            component={ReduxVerticalFormGroup}
            label="Number of vCPUs"
            name="vCPUs"
            inputMode="numeric"
            disabled={editClusterResponse.pending}
            validate={[required, checkDisconnectedvCPU]}
            isRequired
          />
          )}
          <Field
            component={ReduxVerticalFormGroup}
            label="Memory capacity (GiB)"
            name="memoryCapacity"
            inputMode="numeric"
            step="any"
            disabled={editClusterResponse.pending}
            validate={checkDisconnectedMemCapacity}
          />
          <Field
            component={ReduxVerticalFormGroup}
            label="Number of compute nodes"
            name="computeNodes"
            inputMode="numeric"
            disabled={editClusterResponse.pending}
            validate={checkDisconnectedNodeCount}
          />
        </Form>
      </Modal>
    );
  }
}

EditDisconnectedClusterDialog.propTypes = {
  change: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editClusterResponse: PropTypes.object,
  resetResponse: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  initialFormValues: PropTypes.shape({
    id: PropTypes.string,
    vCPUs: PropTypes.number,
    sockets: PropTypes.number,
    computeNodes: PropTypes.number,
    memoryCapacity: PropTypes.number,
  }).isRequired,
  systemType: PropTypes.string.isRequired,
};

EditDisconnectedClusterDialog.defaultProps = {
  editClusterResponse: {},
};

export default EditDisconnectedClusterDialog;
