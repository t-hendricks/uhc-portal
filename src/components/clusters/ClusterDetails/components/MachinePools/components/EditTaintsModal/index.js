import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import EditTaintsModal from './EditTaintsModal';
import {
  getMachineOrNodePools,
  clearGetMachinePoolsResponse,
  clearScaleMachinePoolResponse,
  scaleMachinePool as editTaints,
} from '../../MachinePoolsActions';

import { closeModal } from '../../../../../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'editTaints',
};

const reduxFormEditTaints = reduxForm(reduxFormConfig)(EditTaintsModal);

const valueSelector = formValueSelector('editTaints');

const mapStateToProps = (state) => ({
  machinePoolsList: state.machinePools.getMachinePools,
  selectedMachinePoolId: valueSelector(state, 'machinePoolId') || state.modal.data.machinePool?.id,
  editTaintsResponse: state.machinePools.scaleMachinePoolResponse,
  initialValues: {
    taints: state.modal.data.machinePool?.taints || [{ effect: 'NoSchedule' }],
    machinePoolId: state.modal.data.machinePool?.id,
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () => dispatch(getMachineOrNodePools(ownProps.clusterId, ownProps.isHypershift)),
  resetGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse(ownProps.clusterId)),
  resetEditTaintsResponse: () => dispatch(clearScaleMachinePoolResponse(ownProps.clusterId)),
  onSubmit: (formData) => {
    dispatch(editTaints(ownProps.clusterId, formData.machinePoolId, { taints: formData.taints }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditTaints);
