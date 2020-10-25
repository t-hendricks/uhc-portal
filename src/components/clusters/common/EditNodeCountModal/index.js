import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import get from 'lodash/get';

import EditNodeCountModal from './EditNodeCountModal';
import { closeModal } from '../../../common/Modal/ModalActions';

import { masterResizeAlertThreshold } from '../ScaleClusterDialog/ScaleClusterSelectors';

import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { getMachineTypes } from '../../../../redux/actions/machineTypesActions';
import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import {
  getMachinePools,
  scaleMachinePool,
  clearScaleMachinePoolResponse,
  clearGetMachinePoolsResponse,
} from '../../ClusterDetails/components/MachinePools/MachinePoolsActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const reduxFormConfig = {
  form: 'EditNodeCount',
  enableReinitialize: true,
};
const reduxFormEditNodeCount = reduxForm(reduxFormConfig)(EditNodeCountModal);

const valueSelector = formValueSelector('EditNodeCount');

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  const cluster = modalData?.cluster;
  const selectedMachinePool = valueSelector(state, 'machine_pool')
  || modalData.machinePool?.id
  || (modalData.isDefaultMachinePool && 'Default');

  const commonProps = {
    clusterID: get(cluster, 'id', ''),
    isOpen: shouldShowModal(state, 'edit-node-count'),
    machinePoolsList: {
      ...state.machinePools.getMachinePools,
      data: [
        {
          name: 'Default',
          value: 'Default',
          machineType: get(cluster, 'nodes.compute_machine_type.id', ''),
          nodes: get(cluster, 'nodes.compute', null),
        },
        ...state.machinePools.getMachinePools.data.map(machinePool => ({
          name: machinePool.id,
          value: machinePool.id,
          machineType: machinePool.instance_type,
          nodes: machinePool.replicas,
        })),
      ],
    },
    isMultiAz: get(cluster, 'multi_az', false),
    masterResizeAlertThreshold: masterResizeAlertThreshold(state),
    organization: state.userProfile.organization,
    machineTypes: state.machineTypes,
    cloudProviderID: get(cluster, 'cloud_provider.id', ''),
  };

  // Cluster's default machine pool case
  if (selectedMachinePool === 'Default') {
    return ({
      ...commonProps,
      editNodeCountResponse: state.clusters.editedCluster,
      machineType: get(cluster, 'nodes.compute_machine_type.id', ''),
      machinePoolId: 'Default',
      initialValues: {
        nodes_compute: get(cluster, 'nodes.compute', null),
        machine_pool: 'Default',
      },
    });
  }
  // Any other machine pool
  const selectedMachinePoolData = state.machinePools.getMachinePools.data
    .find(machinePool => machinePool.id === selectedMachinePool);

  return ({
    ...commonProps,
    editNodeCountResponse: state.machinePools.scaleMachinePoolResponse,
    machineType: get(selectedMachinePoolData, 'instance_type', ''),
    machinePoolId: selectedMachinePool,
    initialValues: {
      nodes_compute: get(selectedMachinePoolData, 'replicas', null),
      machine_pool: selectedMachinePool,
    },
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData, clusterID) => {
    if (formData.machine_pool === 'Default') {
      dispatch(editCluster(
        clusterID,
        { nodes: { compute: parseInt(formData.nodes_compute, 10) } },
      ));
    } else {
      dispatch(scaleMachinePool(
        clusterID,
        formData.machine_pool,
        { replicas: parseInt(formData.nodes_compute, 10) },
      ));
    }
  },
  getMachinePools: clusterID => dispatch(getMachinePools(clusterID)),
  resetScaleMachinePoolResponse: () => dispatch(clearScaleMachinePoolResponse()),
  resetScaleDefaultMachinePoolResponse: () => dispatch(clearClusterResponse()),
  resetGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(formData, stateProps.clusterID);
  };
  return ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditNodeCount);
