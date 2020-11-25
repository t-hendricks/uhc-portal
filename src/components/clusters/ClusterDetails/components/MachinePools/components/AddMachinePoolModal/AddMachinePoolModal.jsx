import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import {
  Form, GridItem, Grid, FormGroup,
} from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';
import ScaleSection from '../../../../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/ScaleSection';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { checkMachinePoolName } from '../../../../../../../common/validators';

class AddMachinePoolModal extends Component {
  state = {
    machineType: '',
  };

  componentDidMount() {
    const {
      getOrganizationAndQuota,
      machineTypes,
      getMachineTypes,
    } = this.props;
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    getOrganizationAndQuota();
  }

  componentDidUpdate(prevProps) {
    const {
      addMachinePoolResponse, clearAddMachinePoolResponse, closeModal, getOrganizationAndQuota,
    } = this.props;
    if (!prevProps.addMachinePoolResponse.fulfilled && addMachinePoolResponse.fulfilled) {
      closeModal();
      clearAddMachinePoolResponse();
      getOrganizationAndQuota();
    }
  }

  handleMachineTypesChange = (_, value) => {
    this.setState({ machineType: value });
  };

  cancelAddMachinePool = () => {
    const { clearAddMachinePoolResponse, closeModal } = this.props;
    clearAddMachinePoolResponse();
    closeModal();
  };

  render() {
    const {
      submit,
      addMachinePoolResponse,
      cluster,
      pristine,
      organization,
    } = this.props;

    const { machineType } = this.state;

    const hasError = addMachinePoolResponse.error && (
      <ErrorBox message="Error adding machine pool" response={addMachinePoolResponse} />
    );

    const isPending = addMachinePoolResponse.pending || (organization && organization.pending);

    return (
      <Modal
        variant="large"
        title="Add machine pool"
        onClose={this.cancelAddMachinePool}
        primaryText="Add machine pool"
        secondaryText="Cancel"
        onPrimaryClick={submit}
        onSecondaryClick={this.cancelAddMachinePool}
        isPrimaryDisabled={isPending || pristine}
        isPending={isPending}
      >
        <>
          {hasError}
          <Form className="control-form-cursor" onSubmit={(e) => { submit(); e.preventDefault(); }}>
            <Grid>
              <ScaleSection
                pending={isPending}
                isBYOC={!!cluster?.ccs?.enabled}
                isMultiAz={cluster.multi_az}
                machineType={machineType}
                handleMachineTypesChange={this.handleMachineTypesChange}
                cloudProviderID={cluster.cloud_provider.id}
                product={cluster?.subscription?.plan?.id}
                showStorageAndLoadBalancers={false}
                gridSpan={12}
                minNodes={0}
                isMachinePool
              />
              <GridItem span={4}>
                <FormGroup label="Machine pool name" isRequired>
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="name"
                    type="text"
                    validate={checkMachinePoolName}
                    disabled={isPending}
                  />
                </FormGroup>
              </GridItem>
            </Grid>
          </Form>
        </>
      </Modal>
    );
  }
}

AddMachinePoolModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  clearAddMachinePoolResponse: PropTypes.func.isRequired,
  addMachinePoolResponse: PropTypes.object,
  cluster: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  organization: PropTypes.object,
};

AddMachinePoolModal.defaultProps = {
  addMachinePoolResponse: {},
};

export default AddMachinePoolModal;
