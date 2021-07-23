import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form, Grid, GridItem,
} from '@patternfly/react-core';

import { validateLabels, parseLabels } from '../../machinePoolsHelper';

import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';
import EditMachinePoolAlert from '../EditMachinePoolAlert';
import { ReduxFormDropdown, ReduxFormTagsInput } from '../../../../../../common/ReduxFormComponents';

class EditLabelsModal extends Component {
  componentDidMount() {
    const {
      machinePoolsList,
      getMachinePools,
    } = this.props;

    if (!machinePoolsList.pending) {
      getMachinePools();
    }
  }

  componentDidUpdate() {
    const { editLabelsResponse } = this.props;

    if (editLabelsResponse.fulfilled
          && !editLabelsResponse.pending
          && !editLabelsResponse.error) {
      this.cancelEdit();
    }
  }

  handleMachinePoolChange = (_, value) => {
    const { change, machinePoolsList } = this.props;
    const selectedMachinePool = machinePoolsList.data.find(machinePool => machinePool.id === value);
    if (selectedMachinePool) {
      change('labels', parseLabels(selectedMachinePool.labels));
    }
  };

  cancelEdit = () => {
    const {
      resetEditLabelsResponse,
      resetGetMachinePoolsResponse,
      closeModal,
      reset,
    } = this.props;
    resetEditLabelsResponse();
    resetGetMachinePoolsResponse();
    closeModal();
    reset();
  };

  render() {
    const {
      machinePoolsList,
      handleSubmit,
      editLabelsResponse,
      pristine,
      tags,
    } = this.props;

    const error = editLabelsResponse.error ? (
      <ErrorBox message="Error editing labels" response={editLabelsResponse} />
    ) : null;

    const { pending } = editLabelsResponse;

    return (
      <Modal
        title="Edit labels"
        onClose={this.cancelEdit}
        primaryText="Save"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={this.cancelEdit}
        isPrimaryDisabled={pending || pristine}
        isPending={pending}
        modalSize="medium"
      >
        <>
          <EditMachinePoolAlert />
          {error}
          <Form onSubmit={handleSubmit}>
            <Grid hasGutter>
              <GridItem span={5}>
                <Field
                  component={ReduxFormDropdown}
                  name="machinePoolId"
                  label="Machine pool"
                  options={machinePoolsList.data.map(machinePool => ({
                    name: machinePool.id,
                    value: machinePool.id,
                  }))}
                  onChange={this.handleMachinePoolChange}
                />
              </GridItem>
              <GridItem span={7} />
              <GridItem span={12}>
                <p className="pf-u-mb-md">
                  Labels help you organize and select resources.
                  Adding labels below will let you query for objects
                  that have similar, overlapping or dissimilar labels.
                </p>
                <Field
                  component={ReduxFormTagsInput}
                  name="labels"
                  label="Labels"
                  tags={tags}
                  inputPlaceholder="Add a label"
                  validate={validateLabels}
                />
              </GridItem>
            </Grid>
          </Form>
        </>
      </Modal>
    );
  }
}

EditLabelsModal.defaultProps = {
  tags: [],
};

EditLabelsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  editLabelsResponse: PropTypes.object.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  resetEditLabelsResponse: PropTypes.func.isRequired,
  resetGetMachinePoolsResponse: PropTypes.func.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  tags: PropTypes.array,
};

export default EditLabelsModal;
