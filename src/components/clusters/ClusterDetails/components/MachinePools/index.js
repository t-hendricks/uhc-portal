import { connect } from 'react-redux';
import get from 'lodash/get';

import MachinePools from './MachinePools';
import {
  getMachineOrNodePools,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
  clearDeleteMachinePoolResponse,
} from './MachinePoolsActions';

import {
  isControlPlaneUpToDate,
  isMachinePoolBehindControlPlane,
} from './UpdateMachinePools/updateMachinePoolsHelpers';
import { hasMachinePoolsQuotaSelector } from './MachinePoolsSelectors';
import { normalizeNodePool } from './machinePoolsHelper';

import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { clusterAutoscalerActions } from '../../../../../redux/actions/clusterAutoscalerActions';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';
import { isHypershiftCluster } from '../../clusterDetailsHelper';

const mapStateToProps = (state) => {
  const cluster = get(state, 'clusters.details.cluster', {});

  const props = {
    openModalId: state.modal.modalName,
    machinePoolsList: state.machinePools.getMachinePools,
    addMachinePoolResponse: state.machinePools.addMachinePoolResponse,
    deleteMachinePoolResponse: state.machinePools.deleteMachinePoolResponse,
    scaleMachinePoolResponse: state.machinePools.scaleMachinePoolResponse,
    hasMachinePoolsQuota: hasMachinePoolsQuotaSelector(state),
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
    canMachinePoolBeUpdated: (machinePool) =>
      isControlPlaneUpToDate(state) && isMachinePoolBehindControlPlane(state, machinePool),
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
    getMachinePools: () => {
      dispatch(getMachineOrNodePools(ownProps.cluster.id, isHypershift));
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
