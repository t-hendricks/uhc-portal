import { connect } from 'react-redux';
import get from 'lodash/get';
import modals from '~/components/common/Modal/modals';
import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';

import {
  ENABLE_MACHINE_CONFIGURATION,
  HCP_USE_NODE_UPGRADE_POLICIES,
} from '~/redux/constants/featureConstants';
import { featureGateSelector } from '~/hooks/useFeatureGate';
import MachinePools from './MachinePools';
import {
  getMachineOrNodePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
  clearDeleteMachinePoolResponse,
} from './MachinePoolsActions';

import { canMachinePoolBeUpgradedSelector } from './UpdateMachinePools/updateMachinePoolsHelpers';
import {
  hasOrgLevelBypassPIDsLimitCapability,
  hasMachinePoolsQuotaSelector,
} from './machinePoolsSelectors';
import { normalizeNodePool } from './machinePoolsHelper';

import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { clusterAutoscalerActions } from '../../../../../redux/actions/clusterAutoscalerActions';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => {
  const cluster = get(state, 'clusters.details.cluster', {});
  const canBypassPIDsLimit = hasOrgLevelBypassPIDsLimitCapability(
    state.userProfile.organization?.details,
  );

  const props = {
    isDeleteMachinePoolModalOpen: shouldShowModal(state, modals.DELETE_MACHINE_POOL),
    isClusterAutoscalingModalOpen: shouldShowModal(state, modals.EDIT_CLUSTER_AUTOSCALING_V1),
    machinePoolsList: state.machinePools.getMachinePools,
    deleteMachinePoolResponse: state.machinePools.deleteMachinePoolResponse,
    hasMachinePoolsQuota: hasMachinePoolsQuotaSelector(
      state.userProfile.organization,
      state.clusters.details,
      state.machineTypes.types,
    ),
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
    canMachinePoolBeUpdated: (machinePool) => canMachinePoolBeUpgradedSelector(state, machinePool),
    useNodeUpgradePolicies: featureGateSelector(state, HCP_USE_NODE_UPGRADE_POLICIES),
    hasMachineConfiguration: featureGateSelector(state, ENABLE_MACHINE_CONFIGURATION),
    canBypassPIDsLimit,
  };

  const machinePoolsList = isHypershiftCluster(cluster)
    ? {
        ...props.machinePoolsList,
        data: props.machinePoolsList.data.map(normalizeNodePool),
      }
    : props.machinePoolsList;
  return {
    ...props,
    clusterAutoscalerResponse: state.clusterAutoscaler,
    machinePoolsList,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const isHypershift = isHypershiftCluster(ownProps.cluster);
  return {
    openModal: (modalId, data) => dispatch(openModal(modalId, data)),
    closeModal: () => dispatch(closeModal()),
    getMachinePools: (skipMachinePoolPolicies) => {
      dispatch(
        getMachineOrNodePools(
          ownProps.cluster.id,
          isHypershift,
          ownProps.cluster.version.id,
          skipMachinePoolPolicies,
        ),
      );
      dispatch(
        clusterAutoscalerActions.setHasInitialClusterAutoscaler(!!ownProps.cluster.autoscaler),
      );
    },
    clearGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse(ownProps.clusterID)),
    clearDeleteMachinePoolResponse: () =>
      dispatch(clearDeleteMachinePoolResponse(ownProps.clusterID)),
    deleteMachinePool: (machinePoolID) =>
      dispatch(deleteMachinePool(ownProps.cluster.id, machinePoolID, isHypershift)),
    getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
    getMachineTypes: () => dispatch(getMachineTypes()),
    getClusterAutoscaler: () =>
      dispatch(clusterAutoscalerActions.getClusterAutoscaler(ownProps.cluster.id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MachinePools);
