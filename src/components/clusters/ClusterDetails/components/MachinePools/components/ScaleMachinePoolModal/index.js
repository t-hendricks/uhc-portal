import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';

import ScaleMachinePoolModal from './ScaleMachinePoolModal';
import { closeModal } from '../../../../../../common/Modal/ModalActions';

import {
  minValueSelector,
  masterResizeAlertThreshold,
} from '../../../../../common/ScaleClusterDialog/ScaleClusterSelectors';

import { getOrganizationAndQuota } from '../../../../../../../redux/actions/userActions';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { clearClusterResponse, editCluster } from '../../../../../../../redux/actions/clustersActions';
import { scaleMachinePool, clearScaleMachinePoolResponse } from '../../MachinePoolsActions';

const reduxFormConfig = {
  form: 'ScaleMachinePool',
  enableReinitialize: true,
};
const reduxFormEditCluster = reduxForm(reduxFormConfig)(ScaleMachinePoolModal);

const mapStateToProps = (state, ownProps) => {
  const modalData = state.modal.data;
  const { isDefaultMachinePool } = modalData;

  return ({
    scaleMachinePoolResponse: isDefaultMachinePool
      ? state.clusters.editedCluster : state.machinePools.scaleMachinePoolResponse,
    min: minValueSelector(ownProps.cluster.multi_az, ownProps.cluster.byoc),
    isMultiAz: ownProps.cluster.multi_az,
    masterResizeAlertThreshold: masterResizeAlertThreshold(state),
    organization: state.userProfile.organization,
    machineTypes: state.machineTypes,
    isDefaultMachinePool,
    cloudProviderID: get(modalData, 'cluster.cloud_provider.id', ''),
    machineType: get(modalData, 'machinePool.instance_type', ''),
    machinePoolId: get(modalData, 'machinePool.id', ''),
    initialValues: {
      nodes_compute: isDefaultMachinePool ? get(modalData, 'machinePool.desired', null) : get(modalData, 'machinePool.replicas', null),
    },
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData, isDefaultMachinePool, machinePoolId) => {
    let request = {};
    if (isDefaultMachinePool) {
      request = {
        nodes: {
          compute: parseInt(formData.nodes_compute, 10),
        },
      };
      dispatch(editCluster(ownProps.cluster.id, request));
    } else {
      request = {
        replicas: parseInt(formData.nodes_compute, 10),
      };
      dispatch(scaleMachinePool(ownProps.cluster.id, machinePoolId, request));
    }
  },
  resetScaleMachinePoolResponse: () => dispatch(clearScaleMachinePoolResponse()),
  resetScaleDefaultMachinePoolResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const onSubmit = (formData) => {
    dispatchProps.onSubmit(formData, stateProps.isDefaultMachinePool, stateProps.machinePoolId);
  };
  return ({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    onSubmit,
  });
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(reduxFormEditCluster);
