import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Alert, Form, Grid, GridItem } from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';
import { SpotInstanceInfoAlert, isMachinePoolUsingSpotInstances } from '../SpotInstanceHelper';

import { ReduxFormDropdown, ReduxFormTaints } from '../../../../../../common/ReduxFormComponents';

import {
  hasStaticDefaultMachinePool,
  isEnforcedDefaultMachinePool,
} from '../../machinePoolsHelper';

class EditTaintsModal extends Component {
  componentDidMount() {
    const { machinePoolsList, getMachinePools, machineTypes, getMachineTypes } = this.props;

    if (!machinePoolsList.pending) {
      getMachinePools();
    }
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
  }

  componentDidUpdate() {
    const { editTaintsResponse } = this.props;

    if (editTaintsResponse.fulfilled && !editTaintsResponse.pending && !editTaintsResponse.error) {
      this.cancelEdit();
    }
  }

  handleMachinePoolChange = (_, value) => {
    const { change, machinePoolsList } = this.props;
    const selectedMachinePoolTaints = machinePoolsList.data.find(
      (machinePool) => machinePool.id === value,
    )?.taints;

    change('taints', selectedMachinePoolTaints || [{ effect: 'NoSchedule' }]);
  };

  cancelEdit = () => {
    const { resetEditTaintsResponse, closeModal, reset } = this.props;
    resetEditTaintsResponse();
    closeModal();
    reset();
  };

  render() {
    const {
      machinePoolsList,
      handleSubmit,
      editTaintsResponse,
      pristine,
      selectedMachinePoolId,
      invalid,
      machineTypes,
      cluster,
    } = this.props;

    const error = editTaintsResponse.error ? (
      <ErrorBox message="Error editing taints" response={editTaintsResponse} />
    ) : null;

    const { pending } = editTaintsResponse;
    const isEnforcedDefaultMP =
      !hasStaticDefaultMachinePool(cluster) &&
      isEnforcedDefaultMachinePool(
        selectedMachinePoolId,
        machinePoolsList.data,
        machineTypes,
        cluster,
      );

    return (
      <Modal
        title="Edit taints"
        onClose={this.cancelEdit}
        primaryText="Save"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={this.cancelEdit}
        isPrimaryDisabled={pending || pristine || invalid}
        isPending={pending}
        modalSize="medium"
      >
        <>
          {error}
          <Form onSubmit={handleSubmit}>
            <Grid hasGutter>
              <GridItem span={5}>
                <Field
                  component={ReduxFormDropdown}
                  name="machinePoolId"
                  label="Machine pool"
                  options={machinePoolsList.data.map((machinePool) => ({
                    name: machinePool.id,
                    value: machinePool.id,
                  }))}
                  onChange={this.handleMachinePoolChange}
                />
              </GridItem>
              <GridItem span={7} />
              <GridItem>
                <FieldArray
                  name="taints"
                  component={ReduxFormTaints}
                  isEditing
                  canAddMore={!invalid && !isEnforcedDefaultMP}
                />
              </GridItem>

              {isEnforcedDefaultMP && (
                <GridItem>
                  <Alert
                    title="Taints cannot be added to default machine pool"
                    isInline
                    variant="info"
                  />
                </GridItem>
              )}
              {isMachinePoolUsingSpotInstances(selectedMachinePoolId, machinePoolsList) && (
                <>
                  <GridItem>
                    <SpotInstanceInfoAlert />
                  </GridItem>
                </>
              )}
            </Grid>
          </Form>
        </>
      </Modal>
    );
  }
}

EditTaintsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editTaintsResponse: PropTypes.object.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  resetEditTaintsResponse: PropTypes.func.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  selectedMachinePoolId: PropTypes.string.isRequired,
  machineTypes: PropTypes.object.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  cluster: PropTypes.object.isRequired,
};

export default EditTaintsModal;
