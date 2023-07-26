import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import EditTaintsModal from './EditTaintsModal';
import {
  getMachineOrNodePools,
  clearScaleMachinePoolResponse,
  patchMachinePoolOrNodePool as editTaints,
} from '../../MachinePoolsActions';

import { closeModal } from '../../../../../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'editTaints',
};

const reduxFormEditTaints = reduxForm(reduxFormConfig)(EditTaintsModal);

const valueSelector = formValueSelector('editTaints');

// Only empty string is accepted on the API as an empty value. The API then returns it as `null`
const adaptApiTaints = (taints) =>
  taints.map((taint) => (taint.value === null ? { ...taint, value: '' } : taint));

const mapStateToProps = (state) => {
  const taints = state.modal.data.machinePool?.taints;
  return {
    machinePoolsList: state.machinePools.getMachinePools,
    selectedMachinePoolId:
      valueSelector(state, 'machinePoolId') || state.modal.data.machinePool?.id,
    editTaintsResponse: state.machinePools.scaleMachinePoolResponse,
    initialValues: {
      taints: taints ? adaptApiTaints(taints) : [{ effect: 'NoSchedule' }],
      machinePoolId: state.modal.data.machinePool?.id,
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () =>
    dispatch(getMachineOrNodePools(ownProps.clusterId, ownProps.isHypershiftCluster)),
  resetEditTaintsResponse: () => dispatch(clearScaleMachinePoolResponse(ownProps.clusterId)),
  onSubmit: (formData) => {
    dispatch(
      editTaints(
        ownProps.clusterId,
        formData.machinePoolId,
        { taints: adaptApiTaints(formData.taints) },
        ownProps.isHypershiftCluster,
      ),
    );
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditTaints);
