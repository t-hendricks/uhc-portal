import React, { Component } from 'react';
import get from 'lodash/get';
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
import CostSavingsSection from './CostSavingsSection';

class AddMachinePoolModal extends Component {
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
      invalid,
      organization,
      canAutoScale,
      autoscalingEnabled,
      change,
      selectedMachineType,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      canUseSpotInstances,
      useSpotInstances,
      spotInstancePricing,
      spotInstanceMaxHourlyPrice,
    } = this.props;

    const billingModel = get(cluster, 'billing_model');

    const hasError = addMachinePoolResponse.error && (
      <ErrorBox message="Error adding machine pool" response={addMachinePoolResponse} />
    );

    const modalDescription = 'A machine pool is a group of machines that are all clones of the same configuration, that can be used on demand by an application running on a pod.';

    const isPending = addMachinePoolResponse.pending || (organization && organization.pending);

    return (
      <Modal
        variant="large"
        title="Add machine pool"
        onClose={this.cancelAddMachinePool}
        description={modalDescription}
        primaryText="Add machine pool"
        secondaryText="Cancel"
        onPrimaryClick={submit}
        onSecondaryClick={this.cancelAddMachinePool}
        isPrimaryDisabled={isPending || pristine || invalid}
        isPending={isPending}
      >
        <>
          {hasError}
          <Form className="control-form-cursor" onSubmit={(e) => { submit(); e.preventDefault(); }}>
            <Grid>
              <GridItem md={6}>
                <FormGroup label="Machine pool name" className="pf-u-mb-md" isRequired>
                  <Field
                    component={ReduxVerticalFormGroup}
                    name="name"
                    type="text"
                    validate={checkMachinePoolName}
                    disabled={isPending}
                  />
                </FormGroup>
              </GridItem>
              <GridItem md={6} />
              <ScaleSection
                pending={isPending}
                isBYOC={!!cluster?.ccs?.enabled}
                isMultiAz={cluster.multi_az}
                machineType={selectedMachineType}
                cloudProviderID={cluster.cloud_provider.id}
                product={cluster?.subscription?.plan?.type}
                showStorageAndLoadBalancers={false}
                minNodes={0}
                isMachinePool
                inModal
                canAutoScale={canAutoScale}
                autoscalingEnabled={autoscalingEnabled}
                change={change}
                autoScaleMinNodesValue={autoScaleMinNodesValue}
                autoScaleMaxNodesValue={autoScaleMaxNodesValue}
                billingModel={billingModel}
              />
              {/* Cost savings */}
              { canUseSpotInstances
              && (
                <>
                  <CostSavingsSection
                    useSpotInstances={useSpotInstances}
                    spotInstancePricing={spotInstancePricing}
                    spotInstanceMaxHourlyPrice={spotInstanceMaxHourlyPrice}
                    change={change}
                  />
                </>
              )}
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
  invalid: PropTypes.bool.isRequired,
  organization: PropTypes.object,
  selectedMachineType: PropTypes.string,
  canAutoScale: PropTypes.bool.isRequired,
  autoscalingEnabled: PropTypes.bool.isRequired,
  change: PropTypes.func.isRequired,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  canUseSpotInstances: PropTypes.bool.isRequired,
  useSpotInstances: PropTypes.bool.isRequired,
  spotInstancePricing: PropTypes.string,
  spotInstanceMaxHourlyPrice: PropTypes.number,
};

AddMachinePoolModal.defaultProps = {
  addMachinePoolResponse: {},
  autoScaleMinNodesValue: '0',
  autoScaleMaxNodesValue: '0',
  spotInstancePricing: 'onDemand',
  spotInstanceMaxHourlyPrice: 0.00,
};

export default AddMachinePoolModal;
