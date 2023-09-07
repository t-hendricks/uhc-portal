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
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';
import { isHypershiftCluster } from '../../clusterDetailsHelper';

import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import modals from '../../../../common/Modal/modals';

const mapStateToProps = (state) => {
  const cluster = get(state, 'clusters.details.cluster', {});

  const props = {
    isAddMachinePoolModalOpen: shouldShowModal(state, 'add-machine-pool'),
    isDeleteMachinePoolModalOpen: shouldShowModal(state, 'delete-machine-pool'),
    isEditTaintsModalOpen: shouldShowModal(state, modals.EDIT_TAINTS),
    isEditLabelsModalOpen: shouldShowModal(state, modals.EDIT_LABELS),
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
    getMachinePools: () => dispatch(getMachineOrNodePools(ownProps.cluster.id, isHypershift)),
    clearGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse(ownProps.clusterID)),
    clearDeleteMachinePoolResponse: () =>
      dispatch(clearDeleteMachinePoolResponse(ownProps.clusterID)),
    deleteMachinePool: (machinePoolID) =>
      dispatch(deleteMachinePool(ownProps.cluster.id, machinePoolID, isHypershift)),
    getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
    getMachineTypes: () => dispatch(getMachineTypes()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MachinePools);
