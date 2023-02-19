import { connect } from 'react-redux';
import get from 'lodash/get';

import MachinePools from './MachinePools';
import {
  getMachineOrNodePools,
  addMachinePool,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
  clearDeleteMachinePoolResponse,
} from './MachinePoolsActions';
import { hasMachinePoolsQuotaSelector } from './MachinePoolsSelectors';
import { normalizeNodePool } from './machinePoolsHelper';

import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';

import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import modals from '../../../../common/Modal/modals';

const mapStateToProps = (state, ownProps) => {
  const cluster = get(state, 'clusters.details.cluster', {});
  const nodes = get(cluster, 'nodes', {});

  const props = {
    isAddMachinePoolModalOpen: shouldShowModal(state, 'add-machine-pool'),
    isEditTaintsModalOpen: shouldShowModal(state, modals.EDIT_TAINTS),
    isEditLabelsModalOpen: shouldShowModal(state, modals.EDIT_LABELS),
    machinePoolsList: state.machinePools.getMachinePools,
    addMachinePoolResponse: state.machinePools.addMachinePoolResponse,
    deleteMachinePoolResponse: state.machinePools.deleteMachinePoolResponse,
    scaleMachinePoolResponse: state.machinePools.scaleMachinePoolResponse,
    hasMachinePoolsQuota: hasMachinePoolsQuotaSelector(state),
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
  };

  if (ownProps.isHypershift) {
    return {
      ...props,
      machinePoolsList: {
        ...props.machinePoolsList,
        data: state.machinePools.getMachinePools.data.map(normalizeNodePool),
      },
    };
  }

  // align the default machine pool structure to additional machine pools structure
  const defaultMachinePool = {
    id: 'Default',
    instance_type: nodes.compute_machine_type?.id,
    availability_zones: nodes.availability_zones,
    labels: nodes.compute_labels,
  };

  if (nodes.autoscale_compute) {
    defaultMachinePool.autoscaling = { ...nodes.autoscale_compute };
  } else {
    defaultMachinePool.desired = nodes.compute;
  }

  return {
    defaultMachinePool,
    ...props,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: (modalId, data) => dispatch(openModal(modalId, data)),
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () =>
    dispatch(getMachineOrNodePools(ownProps.cluster.id, ownProps.isHypershift)),
  addMachinePool: () => dispatch(addMachinePool(ownProps.clusterID)),
  clearGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse(ownProps.clusterID)),
  clearDeleteMachinePoolResponse: () =>
    dispatch(clearDeleteMachinePoolResponse(ownProps.clusterID)),
  submit: (params) => {
    dispatch(addMachinePool(ownProps.clusterID, params));
  },
  deleteMachinePool: (machinePoolID) =>
    dispatch(deleteMachinePool(ownProps.cluster.id, machinePoolID, ownProps.isHypershift)),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MachinePools);
