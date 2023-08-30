import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Form, Alert, Grid, GridItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import {
  getMinNodesRequired,
  getMinNodesRequiredHypershift,
  hasDefaultOrExplicitAutoscalingMachinePool,
  isEnforcedDefaultMachinePool,
} from '~/components/clusters/ClusterDetails/components/MachinePools/machinePoolsHelper';
import MachinePoolsAutoScalingWarning from '~/components/clusters/ClusterDetails/components/MachinePools/MachinePoolAutoscalingWarning';
import NodeCountInput from '../NodeCountInput';
import { ReduxFormDropdown } from '../../../common/ReduxFormComponents';
import { normalizedProducts, billingModels } from '../../../../common/subscriptionTypes';
import links from '../../../../common/installLinks.mjs';
import ExternalLink from '../../../common/ExternalLink';

import AutoScaleSection from '../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleSection';
import {
  SpotInstanceInfoAlert,
  isMachinePoolUsingSpotInstances,
} from '../../ClusterDetails/components/MachinePools/components/SpotInstanceHelper';

import Modal from '../../../common/Modal/Modal';
import ErrorBox from '../../../common/ErrorBox';
import modals from '../../../common/Modal/modals';

class EditNodeCountModal extends Component {
  componentDidMount() {
    const {
      organization,
      getOrganizationAndQuota,
      machineTypes,
      getMachineTypes,
      machinePoolsList,
      getMachinePools,
      clusterID,
      isHypershiftCluster,
    } = this.props;
    if (!machineTypes.fulfilled && !machineTypes.pending) {
      getMachineTypes();
    }
    if (!organization.pending) {
      getOrganizationAndQuota();
    }
    if (!machinePoolsList.pending) {
      getMachinePools(clusterID, isHypershiftCluster);
    }
  }

  componentDidUpdate() {
    const { getOrganizationAndQuota, onClose, editNodeCountResponse } = this.props;
    if (
      editNodeCountResponse.fulfilled &&
      !editNodeCountResponse.pending &&
      !editNodeCountResponse.error
    ) {
      this.cancelEdit();
      getOrganizationAndQuota();
      onClose();
    }
  }

  componentWillUnmount() {
    const { resetSection } = this.props;
    this.resetResponse();
    resetSection(
      'machine_pool',
      'nodes_compute',
      'autoscalingEnabled',
      'min_replicas',
      'max_replicas',
    );
  }

  getSelectedMachinePoolNodes(machinePoolId) {
    const { machinePoolsList } = this.props;
    return machinePoolsList.data.find((machinePool) => machinePool.name === machinePoolId)?.nodes;
  }

  handleMachinePoolChange = (_, value) => {
    const { change } = this.props;
    change('nodes_compute', this.getSelectedMachinePoolNodes(value));
  };

  cancelEdit = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  resetResponse() {
    const {
      resetGetMachinePoolsResponse,
      resetScaleMachinePoolResponse,
      clearMachineOrNodePoolsOnExit,
    } = this.props;

    if (clearMachineOrNodePoolsOnExit) {
      resetGetMachinePoolsResponse();
    }
    resetScaleMachinePoolResponse();
  }

  render() {
    const {
      isValid,
      machinePoolsList,
      handleSubmit,
      isMultiAz,
      masterResizeAlertThreshold,
      initialValues,
      organization,
      isByoc,
      cloudProviderID,
      product,
      editNodeCountResponse,
      machineType,
      machinePoolId,
      pristine,
      change,
      canAutoScale,
      autoscalingEnabled,
      autoScaleMinNodesValue,
      autoScaleMaxNodesValue,
      billingModel,
      hasClusterAutoScaler,
      shouldDisplayClusterName,
      clusterDisplayName,
      cluster,
      clusterID,
      isHypershiftCluster,
      machineTypes,
    } = this.props;
    let minNodesRequired = 0;

    if (isHypershiftCluster) {
      minNodesRequired = getMinNodesRequiredHypershift();
    } else {
      const isEnforcedDefaultMP = isEnforcedDefaultMachinePool(
        machinePoolId,
        machinePoolsList.data.map((mp) => ({
          ...mp.originalResponse,
        })),
        machineTypes,
        cluster,
      );
      minNodesRequired = getMinNodesRequired(isEnforcedDefaultMP, isByoc, isMultiAz);
    }

    const error = editNodeCountResponse.error ? (
      <ErrorBox message="Error editing machine pool" response={editNodeCountResponse} />
    ) : null;

    const hasAutoscalingMachinePools = hasDefaultOrExplicitAutoscalingMachinePool(
      cluster,
      machinePoolsList?.data,
      machinePoolId,
    );

    const autoScaleWarning = !isHypershiftCluster && (
      <MachinePoolsAutoScalingWarning
        warningType="editMachinePool"
        hasClusterAutoScaler={hasClusterAutoScaler}
        hasAutoscalingMachinePools={hasAutoscalingMachinePools}
        isEnabledOnCurrentPool={autoscalingEnabled}
      />
    );

    const resizingAlert = (nodes) => (
      <Alert
        variant="warning"
        isInline
        title={
          autoscalingEnabled
            ? `Autoscaling to a maximum node count of more than ${nodes} nodes may trigger manual Red Hat SRE intervention`
            : `Scaling node count to more than ${nodes} nodes may trigger manual Red Hat SRE intervention`
        }
      >
        <div>
          <p>
            Node scaling is automatic and will be performed immediately. Scaling node count beyond
            Red Hat&apos;s{' '}
            <ExternalLink href={links.ROSA_AWS_LIMITS_SCALE} noIcon>
              documented thresholds
            </ExternalLink>{' '}
            may trigger manual Red Hat SRE intervention to vertically scale your Infrastructure and
            Control Plane instances.{' '}
            {autoScaleMaxNodesValue &&
              'Autoscaling nodes will not trigger manual intervention until the actual node count crosses the threshold. '}
            To request that Red Hat SRE proactively increase your Infrastructure and Control Plane
            instances, please open a <Link to={`/details/${clusterID}#support`}>support case</Link>.
          </p>
        </div>
      </Alert>
    );

    const pending =
      editNodeCountResponse.pending || organization.pending || machinePoolsList.pending;

    return (
      <Modal
        className="edit-cluster-modal edit-cluster-modal-rhinfra"
        title="Edit node count"
        secondaryTitle={shouldDisplayClusterName ? clusterDisplayName : undefined}
        onClose={this.cancelEdit}
        primaryText="Apply"
        onPrimaryClick={handleSubmit}
        onSecondaryClick={this.cancelEdit}
        isPrimaryDisabled={pending || pristine || !isValid}
        isPending={pending}
        isSmall
        isHypershift={isHypershiftCluster}
      >
        <>
          {error}
          <Form onSubmit={handleSubmit}>
            <Grid hasGutter>
              <GridItem span={8}>
                <Field
                  component={ReduxFormDropdown}
                  name="machine_pool"
                  label="Machine pool"
                  options={machinePoolsList.data}
                  onChange={this.handleMachinePoolChange}
                />
              </GridItem>
              <GridItem span={4} />
              {canAutoScale && (
                <>
                  <GridItem>
                    <AutoScaleSection
                      autoscalingEnabled={autoscalingEnabled}
                      isMultiAz={isMultiAz}
                      change={change}
                      autoScaleMinNodesValue={autoScaleMinNodesValue}
                      autoScaleMaxNodesValue={autoScaleMaxNodesValue}
                      product={product}
                      isBYOC={isByoc}
                      minNodesRequired={minNodesRequired}
                    />
                  </GridItem>
                </>
              )}
              {!autoscalingEnabled && (
                <>
                  <GridItem span={8}>
                    <Field
                      component={NodeCountInput}
                      name="nodes_compute"
                      label={isMultiAz ? 'Node count per zone' : 'Node count'}
                      isMultiAz={isMultiAz}
                      isByoc={isByoc}
                      machineType={machineType}
                      isDisabled={pending}
                      isEditingCluster
                      currentNodeCount={initialValues.nodes_compute || 0}
                      cloudProviderID={cloudProviderID}
                      product={product}
                      minNodes={minNodesRequired}
                      isMachinePool
                      billingModel={billingModel}
                    />
                  </GridItem>
                  <GridItem span={4} />
                </>
              )}

              {!!autoScaleWarning && <GridItem md={12}>{autoScaleWarning}</GridItem>}

              {!!masterResizeAlertThreshold && resizingAlert(masterResizeAlertThreshold)}
              {isMachinePoolUsingSpotInstances(machinePoolId, machinePoolsList) && (
                <>
                  <GridItem span={7} />
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

EditNodeCountModal.propTypes = {
  isValid: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetGetMachinePoolsResponse: PropTypes.func.isRequired,
  resetScaleMachinePoolResponse: PropTypes.func.isRequired,
  editNodeCountResponse: PropTypes.object,
  isMultiAz: PropTypes.bool,
  initialValues: PropTypes.shape({
    id: PropTypes.string,
    nodes_compute: PropTypes.number,
    autoscalingEnabled: PropTypes.bool,
  }).isRequired,
  masterResizeAlertThreshold: PropTypes.number,
  organization: PropTypes.object.isRequired,
  getOrganizationAndQuota: PropTypes.func.isRequired,
  machineTypes: PropTypes.object.isRequired,
  getMachineTypes: PropTypes.func.isRequired,
  getMachinePools: PropTypes.func.isRequired,
  machinePoolsList: PropTypes.object.isRequired,
  cluster: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  isByoc: PropTypes.bool,
  hasClusterAutoScaler: PropTypes.bool,
  isHypershiftCluster: PropTypes.bool.isRequired,
  machinePoolId: PropTypes.string,
  machineType: PropTypes.string,
  clusterID: PropTypes.string,
  cloudProviderID: PropTypes.string.isRequired,
  product: PropTypes.oneOf([...Object.keys(normalizedProducts), '']).isRequired,
  pristine: PropTypes.bool,
  autoscalingEnabled: PropTypes.bool,
  canAutoScale: PropTypes.bool,
  autoScaleMinNodesValue: PropTypes.string,
  autoScaleMaxNodesValue: PropTypes.string,
  billingModel: PropTypes.oneOf(Object.values(billingModels)).isRequired,
  shouldDisplayClusterName: PropTypes.bool,
  clusterDisplayName: PropTypes.string,
  resetSection: PropTypes.func.isRequired,
  clearMachineOrNodePoolsOnExit: PropTypes.bool,
};

EditNodeCountModal.defaultProps = {
  editNodeCountResponse: {},
  autoscalingEnabled: false,
};

EditNodeCountModal.modalName = modals.EDIT_NODE_COUNT;

export default EditNodeCountModal;
