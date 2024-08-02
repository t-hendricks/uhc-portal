import get from 'lodash/get';
import { connect } from 'react-redux';

import { isHypershiftCluster } from '~/components/clusters/common/clusterStates';
import modals from '~/components/common/Modal/modals';
import { featureGateSelector } from '~/hooks/useFeatureGate';
import { ENABLE_MACHINE_CONFIGURATION } from '~/redux/constants/featureConstants';

import { clusterAutoscalerActions } from '../../../../../redux/actions/clusterAutoscalerActions';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { closeModal, openModal } from '../../../../common/Modal/ModalActions';
import shouldShowModal from '../../../../common/Modal/ModalSelectors';

import { canMachinePoolBeUpgradedSelector } from './UpdateMachinePools/updateMachinePoolsHelpers';
import MachinePools from './MachinePools';
import {
  clearDeleteMachinePoolResponse,
  clearGetMachinePoolsResponse,
  deleteMachinePool,
  getMachineOrNodePools,
} from './MachinePoolsActions';
import { normalizeNodePool } from './machinePoolsHelper';
import {
  hasMachinePoolsQuotaSelector,
  hasOrgLevelBypassPIDsLimitCapability,
} from './machinePoolsSelectors';

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
      state.clusters.details.cluster,
      state.machineTypes.types,
    ),
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
    canMachinePoolBeUpdated: (machinePool) => canMachinePoolBeUpgradedSelector(state, machinePool),
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
