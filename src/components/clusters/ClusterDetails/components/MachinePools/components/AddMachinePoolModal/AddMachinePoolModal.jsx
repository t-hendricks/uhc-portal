import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Form, GridItem, Grid, FormGroup, Spinner } from '@patternfly/react-core';

import Modal from '../../../../../../common/Modal/Modal';
import ErrorBox from '../../../../../../common/ErrorBox';
import ScaleSection from '../../../../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/ScaleSection';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { checkMachinePoolName } from '../../../../../../../common/validators';
import CostSavingsSection from './CostSavingsSection';
import { isMultiAZ } from '../../../../clusterDetailsHelper';

class AddMachinePoolModal extends Component {
  componentDidMount() {
    const {
      getOrganizationAndQuota,
      machineTypes,
      getMachineTypes,
      cluster,
      getAWSVPCs,
      isHypershiftCluster,
    } = this.props;
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    getOrganizationAndQuota();
    if (isHypershiftCluster) {
      getAWSVPCs(cluster);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      addMachinePoolResponse,
      clearAddMachinePoolResponse,
      closeModal,
      getOrganizationAndQuota,
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

  // Ensure that an entered subnet is:
  //    is not empty
  //    tied to the same vpc as the control plane
  //    is private
  checkSubnetId = (value) => {
    const { vpcListBySubnet, cluster } = this.props;

    if (!value) {
      // Ensure that a something is entered in the subnet field
      return 'Private subnet is required';
    }

    let clusterVPC;
    if (
      vpcListBySubnet &&
      cluster.aws.subnet_ids &&
      cluster.aws.subnet_ids.length > 0 &&
      vpcListBySubnet[cluster.aws.subnet_ids[0]]
    ) {
      clusterVPC = vpcListBySubnet[cluster.aws.subnet_ids[0]].vpc_id;
    } else {
      // There isn't enough information to perform validation
      // Most likely because the call to get vpcs failed
      // Validation will be done by the API
      return undefined;
    }

    if (
      !vpcListBySubnet[value] ||
      vpcListBySubnet[value].public ||
      clusterVPC !== vpcListBySubnet[value].vpc_id
    ) {
      return 'No such private subnet';
    }

    return undefined;
  };

  render() {
    const {
      submit,
      addMachinePoolResponse,
      cluster,
      isHypershiftCluster,
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
      vpcListPending,
    } = this.props;

    const billingModel = get(cluster, 'billing_model');

    const hasError = addMachinePoolResponse.error && (
      <ErrorBox message="Error adding machine pool" response={addMachinePoolResponse} />
    );

    const modalDescription =
      'A machine pool is a group of machines that are all clones of the same configuration, that can be used on demand by an application running on a pod.';

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
        isPrimaryDisabled={
          isPending || pristine || invalid || (isHypershiftCluster && vpcListPending)
        }
        isPending={isPending}
      >
        <>
          {hasError}
          <Form
            className="control-form-cursor"
            onSubmit={(e) => {
              submit();
              e.preventDefault();
            }}
          >
            <Grid hasGutter md={6}>
              <GridItem md={6}>
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
              <GridItem md={6} />
              <ScaleSection
                pending={isPending}
                isBYOC={!!cluster?.ccs?.enabled}
                isMultiAz={isMultiAZ(cluster)}
                machineType={selectedMachineType}
                cloudProviderID={cluster.cloud_provider.id}
                product={cluster?.subscription?.plan?.type}
                isHypershiftCluster={isHypershiftCluster}
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
              {canUseSpotInstances && (
                <>
                  <CostSavingsSection
                    useSpotInstances={useSpotInstances}
                    spotInstancePricing={spotInstancePricing}
                    spotInstanceMaxHourlyPrice={spotInstanceMaxHourlyPrice}
                    change={change}
                  />
                </>
              )}
              {isHypershiftCluster && (
                <>
                  <GridItem md={6}>
                    {!vpcListPending ? (
                      <FormGroup label="Private subnet ID" isRequired>
                        <Field
                          component={ReduxVerticalFormGroup}
                          name="subnet"
                          type="text"
                          validate={this.checkSubnetId}
                          disabled={vpcListPending}
                        />
                      </FormGroup>
                    ) : (
                      <>
                        <div className="spinner-fit-container">
                          <Spinner size="md" />
                        </div>
                        <div className="spinner-loading-text">Loading subnets ...</div>
                      </>
                    )}
                  </GridItem>
                  <GridItem md={6} />
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
  isHypershiftCluster: PropTypes.bool.isRequired,
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
  getAWSVPCs: PropTypes.func,
  vpcListPending: PropTypes.bool,
  vpcListBySubnet: PropTypes.object,
};

AddMachinePoolModal.defaultProps = {
  addMachinePoolResponse: {},
  autoScaleMinNodesValue: '0',
  autoScaleMaxNodesValue: '0',
  spotInstancePricing: 'onDemand',
  spotInstanceMaxHourlyPrice: 0.0,
};

export default AddMachinePoolModal;
