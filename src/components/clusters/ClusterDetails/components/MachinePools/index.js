import { connect } from 'react-redux';
import get from 'lodash/get';

import MachinePools from './MachinePools';
import {
  getMachinePools,
  addMachinePool,
  deleteMachinePool,
  clearGetMachinePoolsResponse,
} from './MachinePoolsActions';
import { getOrganizationAndQuota } from '../../../../../redux/actions/userActions';
import { getMachineTypes } from '../../../../../redux/actions/machineTypesActions';
import { openModal, closeModal } from '../../../../common/Modal/ModalActions';

import shouldShowModal from '../../../../common/Modal/ModalSelectors';
import hasMachinePoolsQuotaSelector from './MachinePoolsSelectors';

const mapStateToProps = (state) => {
  const cluster = get(state, 'clusters.details.cluster', {});
  const nodes = get(cluster, 'nodes', {});

  return ({
    isAddMachinePoolModalOpen: shouldShowModal(state, 'add-machine-pool'),
    defaultMachinePool: {
      id: 'Default',
      instance_type: nodes.compute_machine_type?.id,
      availability_zones: nodes.availability_zones,
      desired: nodes.compute,
      labels: nodes.compute_labels,
    },
    machinePoolsList: state.machinePools.getMachinePools,
    addMachinePoolResponse: state.machinePools.addMachinePoolResponse,
    deleteMachinePoolResponse: state.machinePools.deleteMachinePoolResponse,
    scaleMachinePoolResponse: state.machinePools.scaleMachinePoolResponse,
    hasMachinePoolsQuota: hasMachinePoolsQuotaSelector(state),
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
  });
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  openModal: (modalId, data) => dispatch(openModal(modalId, data)),
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () => dispatch(getMachinePools(ownProps.cluster.id)),
  addMachinePool: () => dispatch(addMachinePool(ownProps.clusterID)),
  clearGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse(ownProps.clusterID)),
  submit: (params) => {
    dispatch(addMachinePool(ownProps.clusterID, params));
  },
  deleteMachinePool: machinePoolID => dispatch(
    deleteMachinePool(ownProps.cluster.id, machinePoolID),
  ),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MachinePools);
