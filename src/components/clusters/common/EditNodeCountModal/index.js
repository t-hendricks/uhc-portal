import { connect } from 'react-redux';
import { isValid, reduxForm, formValueSelector, resetSection } from 'redux-form';
import get from 'lodash/get';

import EditNodeCountModal from './EditNodeCountModal';
import { closeModal } from '../../../common/Modal/ModalActions';

import masterResizeAlertThresholdSelector from './EditNodeCountModalSelectors';

import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { getMachineTypes } from '../../../../redux/actions/machineTypesActions';
import {
  getMachineOrNodePools,
  patchMachinePoolOrNodePool,
  clearScaleMachinePoolResponse,
  clearGetMachinePoolsResponse,
} from '../../ClusterDetails/components/MachinePools/MachinePoolsActions';

import { isHypershiftCluster, isMultiAZ } from '../../ClusterDetails/clusterDetailsHelper';

import { canAutoScaleSelector } from '../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import getClusterName from '../../../../common/getClusterName';

const reduxFormConfig = {
  form: 'EditNodeCount',
  enableReinitialize: true,
};
const reduxFormEditNodeCount = reduxForm(reduxFormConfig)(EditNodeCountModal);

const valueSelector = formValueSelector('EditNodeCount');

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  const cluster = modalData?.cluster;

  const isHypershift = isHypershiftCluster(cluster);

  const selectedMachinePool =
    valueSelector(state, 'machine_pool') ||
    modalData.machinePool?.id ||
    state.machinePools.getMachinePools.data[0]?.id ||
    null;

  const cloudProviderID = get(cluster, 'cloud_provider.id', '');

  const isMultiAvailZone = isMultiAZ(cluster);

  let requestedNodes = 0;
  if (valueSelector(state, 'autoscalingEnabled')) {
    const maxReplicas = valueSelector(state, 'max_replicas');
    requestedNodes = isMultiAvailZone ? maxReplicas * 3 : maxReplicas;
  } else {
    requestedNodes = valueSelector(state, 'nodes_compute');
  }

  const commonProps = {
    cluster,
    resetSection: (values) => resetSection(reduxFormConfig.form, values),
    isValid: isValid(reduxFormConfig.form)(state),
    clusterID: get(cluster, 'id', ''),
    isHypershiftCluster: isHypershift,
    machinePoolsList: {
      ...state.machinePools.getMachinePools,
      data: state.machinePools.getMachinePools.data.map((machinePool) => ({
        name: machinePool.id,
        value: machinePool.id,
        machineType: machinePool.instance_type,
        nodes: machinePool.replicas,
        aws: machinePool?.aws,
        originalResponse: machinePool,
      })),
    },
    isMultiAz: isMultiAvailZone,
    masterResizeAlertThreshold: masterResizeAlertThresholdSelector({
      selectedMachinePoolID: selectedMachinePool,
      requestedNodes,
      cluster,
      machinePools: state.machinePools.getMachinePools.data,
      machineTypes: state.machineTypes,
    }),
    organization: state.userProfile.organization,
    machineTypes: state.machineTypes,
    cloudProviderID,
    isByoc: cluster?.ccs?.enabled,
    product: get(cluster, 'subscription.plan.type', ''),
    autoscalingEnabled: !!valueSelector(state, 'autoscalingEnabled'),
    canAutoScale: canAutoScaleSelector(state, get(cluster, 'subscription.plan.type', '')),
    autoScaleMinNodesValue: valueSelector(state, 'min_replicas'),
    autoScaleMaxNodesValue: valueSelector(state, 'max_replicas'),
    billingModel: get(cluster, 'billing_model', ''),
    shouldDisplayClusterName: modalData.shouldDisplayClusterName
      ? modalData.shouldDisplayClusterName
      : false,
    clusterDisplayName: getClusterName(cluster),
    // when launched from cluster list, clear data upon modal exit to prevent stale data
    // should not be true when modal is launched from cluster details > Machine pools tab
    clearMachineOrNodePoolsOnExit: modalData.clearMachineOrNodePoolsOnExit,
  };

  let machinePoolWithAutoscale = false;

  const getMinAndMaxNodesValues = (autoscaleObj) => {
    const min = isHypershift ? autoscaleObj?.min_replica : autoscaleObj.min_replicas;
    const max = isHypershift ? autoscaleObj?.max_replica : autoscaleObj.max_replicas;

    return {
      min_replicas: !isHypershift && isMultiAvailZone ? (min / 3).toString() : min.toString(),
      max_replicas: !isHypershift && isMultiAvailZone ? (max / 3).toString() : max.toString(),
    };
  };

  const selectedMachinePoolData =
    get(state, 'machinePools.getMachinePools.data', []).find(
      (machinePool) => machinePool.id === selectedMachinePool,
    ) || {};

  machinePoolWithAutoscale = selectedMachinePoolData.autoscaling;
  return {
    ...commonProps,
    editNodeCountResponse: state.machinePools.scaleMachinePoolResponse,
    machineType: isHypershift
      ? get(selectedMachinePoolData, 'aws_node_pool.instance_type', '')
      : get(selectedMachinePoolData, 'instance_type', ''),
    machinePoolId: selectedMachinePool,
    machineTypes: state.machineTypes,
    initialValues: {
      nodes_compute:
        get(selectedMachinePoolData, 'replicas', null) ||
        get(machinePoolWithAutoscale, 'min_replicas', null) ||
        get(machinePoolWithAutoscale, 'min_replica', null) ||
        0,
      machine_pool: selectedMachinePool,
      autoscalingEnabled: machinePoolWithAutoscale,
      ...(machinePoolWithAutoscale && getMinAndMaxNodesValues(selectedMachinePoolData.autoscaling)),
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formData, clusterID, isMultiAz, isHypershiftCluster) => {
    const machinePoolRequest = {};
    const nodesCount = parseInt(formData.nodes_compute, 10);

    const minNodes = parseInt(formData.min_replicas, 10);
    const maxNodes = parseInt(formData.max_replicas, 10);

    const autoScaleLimits = {
      min_replicas: isMultiAz ? minNodes * 3 : minNodes,
      max_replicas: isMultiAz ? maxNodes * 3 : maxNodes,
    };

    if (formData.autoscalingEnabled) {
      machinePoolRequest.autoscaling = autoScaleLimits;
    } else {
      machinePoolRequest.replicas = nodesCount;
    }
    dispatch(
      patchMachinePoolOrNodePool(
        clusterID,
        formData.machine_pool,
        machinePoolRequest,
        isHypershiftCluster,
      ),
    );
  },
  getMachinePools: (clusterID, isHypershift) =>
    dispatch(getMachineOrNodePools(clusterID, isHypershift)),
  resetGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse()),
  resetScaleMachinePoolResponse: () => dispatch(clearScaleMachinePoolResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(
      formData,
      stateProps.clusterID,
      !stateProps.isHypershiftCluster && stateProps.isMultiAz,
      stateProps.isHypershiftCluster,
    );
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditNodeCount);
