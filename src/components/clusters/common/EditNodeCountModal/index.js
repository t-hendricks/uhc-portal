import { connect } from 'react-redux';
import { isValid, reduxForm, formValueSelector, resetSection } from 'redux-form';
import get from 'lodash/get';

import EditNodeCountModal from './EditNodeCountModal';
import { closeModal } from '../../../common/Modal/ModalActions';

import masterResizeAlertThresholdSelector from './EditNodeCountModalSelectors';

import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { getMachineTypes } from '../../../../redux/actions/machineTypesActions';
import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import {
  getMachineOrNodePools,
  scaleMachinePool,
  clearScaleMachinePoolResponse,
} from '../../ClusterDetails/components/MachinePools/MachinePoolsActions';

import { isHypershiftCluster } from '../../ClusterDetails/clusterDetailsHelper';

import { canAutoScaleSelector } from '../../ClusterDetails/components/MachinePools/MachinePoolsSelectors';
import getClusterName from '../../../../common/getClusterName';
import { getNodesCount } from '../../CreateOSDPage/CreateOSDForm/FormSections/ScaleSection/AutoScaleSection/AutoScaleHelper';

const reduxFormConfig = {
  form: 'EditNodeCount',
  enableReinitialize: true,
};
const reduxFormEditNodeCount = reduxForm(reduxFormConfig)(EditNodeCountModal);

const valueSelector = formValueSelector('EditNodeCount');

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  const cluster = modalData?.cluster;

  const selectedMachinePool =
    valueSelector(state, 'machine_pool') ||
    modalData.machinePool?.id ||
    (modalData.isDefaultMachinePool && 'Default');

  const cloudProviderID = get(cluster, 'cloud_provider.id', '');

  const isMultiAz = get(cluster, 'multi_az', false);

  let requestedNodes = 0;
  if (valueSelector(state, 'autoscalingEnabled')) {
    const maxReplicas = valueSelector(state, 'max_replicas');
    requestedNodes = isMultiAz ? maxReplicas * 3 : maxReplicas;
  } else {
    requestedNodes = valueSelector(state, 'nodes_compute');
  }

  const commonProps = {
    resetSection: (values) => resetSection(reduxFormConfig.form, values),
    isValid: isValid(reduxFormConfig.form)(state),
    clusterID: get(cluster, 'id', ''),
    isHypershiftCluster: isHypershiftCluster(cluster),
    machinePoolsList: {
      ...state.machinePools.getMachinePools,
      data: [
        {
          name: 'Default',
          value: 'Default',
          machineType: get(cluster, 'nodes.compute_machine_type.id', ''),
          nodes: get(cluster, 'nodes.compute', null),
        },
        ...state.machinePools.getMachinePools.data.map((machinePool) => ({
          name: machinePool.id,
          value: machinePool.id,
          machineType: machinePool.instance_type,
          nodes: machinePool.replicas,
          aws: machinePool?.aws,
        })),
      ],
    },
    isMultiAz,
    masterResizeAlertThreshold: masterResizeAlertThresholdSelector(
      selectedMachinePool,
      requestedNodes,
      cluster,
      state.machinePools.getMachinePools.data,
    ),
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
  };

  let machinePoolWithAutoscale = false;

  const getMinAndMaxNodesValues = (autoscaleObj) => {
    const min = autoscaleObj.min_replicas;
    const max = autoscaleObj.max_replicas;

    return {
      min_replicas: isMultiAz ? (min / 3).toString() : min.toString(),
      max_replicas: isMultiAz ? (max / 3).toString() : max.toString(),
    };
  };

  const initialValuesNodesCompute = getNodesCount(commonProps.isByoc, isMultiAz);

  // Cluster's default machine pool case
  if (selectedMachinePool === 'Default') {
    // eslint-disable-next-line camelcase
    machinePoolWithAutoscale = cluster.nodes?.autoscale_compute;
    return {
      ...commonProps,
      editNodeCountResponse: state.clusters.editedCluster,
      machineType: get(cluster, 'nodes.compute_machine_type.id', ''),
      machinePoolId: 'Default',
      initialValues: {
        nodes_compute:
          get(cluster, 'nodes.compute', null) ||
          get(cluster, 'nodes.autoscale_compute.min_replicas') ||
          initialValuesNodesCompute,
        machine_pool: 'Default',
        autoscalingEnabled: machinePoolWithAutoscale,
        ...(machinePoolWithAutoscale && getMinAndMaxNodesValues(cluster.nodes.autoscale_compute)),
      },
    };
  }
  // Any other machine pool
  const selectedMachinePoolData =
    get(state, 'machinePools.getMachinePools.data', []).find(
      (machinePool) => machinePool.id === selectedMachinePool,
    ) || {};

  machinePoolWithAutoscale = selectedMachinePoolData.autoscaling;

  return {
    ...commonProps,
    editNodeCountResponse: state.machinePools.scaleMachinePoolResponse,
    machineType: get(selectedMachinePoolData, 'instance_type', ''),
    machinePoolId: selectedMachinePool,
    initialValues: {
      nodes_compute:
        get(selectedMachinePoolData, 'replicas', null) ||
        get(machinePoolWithAutoscale, 'min_replicas', null) ||
        0,
      machine_pool: selectedMachinePool,
      autoscalingEnabled: machinePoolWithAutoscale,
      ...(machinePoolWithAutoscale && getMinAndMaxNodesValues(selectedMachinePoolData.autoscaling)),
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formData, clusterID, isMultiAz) => {
    const machinePoolRequest = {};
    const nodesCount = parseInt(formData.nodes_compute, 10);

    const minNodes = parseInt(formData.min_replicas, 10);
    const maxNodes = parseInt(formData.max_replicas, 10);

    const autoScaleLimits = {
      min_replicas: isMultiAz ? minNodes * 3 : minNodes,
      max_replicas: isMultiAz ? maxNodes * 3 : maxNodes,
    };

    if (formData.machine_pool === 'Default') {
      machinePoolRequest.nodes = formData.autoscalingEnabled
        ? { autoscale_compute: autoScaleLimits }
        : { compute: nodesCount };
      dispatch(editCluster(clusterID, machinePoolRequest));
    } else {
      if (formData.autoscalingEnabled) {
        machinePoolRequest.autoscaling = autoScaleLimits;
      } else {
        machinePoolRequest.replicas = nodesCount;
      }
      dispatch(scaleMachinePool(clusterID, formData.machine_pool, machinePoolRequest));
    }
  },
  getMachinePools: (clusterID, isHypershift) =>
    dispatch(getMachineOrNodePools(clusterID, isHypershift)),
  resetScaleMachinePoolResponse: () => dispatch(clearScaleMachinePoolResponse()),
  resetScaleDefaultMachinePoolResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(formData, stateProps.clusterID, stateProps.isMultiAz);
  };
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditNodeCount);
