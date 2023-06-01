import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { parseReduxFormTaints } from '~/common/helpers';
import { getMachineTypes } from '~/redux/actions/machineTypesActions';
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

const mapStateToProps = (state) => {
  const taints = state.modal.data.machinePool?.taints;
  return {
    machinePoolsList: state.machinePools.getMachinePools,
    selectedMachinePoolId:
      valueSelector(state, 'machinePoolId') || state.modal.data.machinePool?.id,
    editTaintsResponse: state.machinePools.scaleMachinePoolResponse,
    initialValues: {
      taints: taints ? parseReduxFormTaints(taints) : [{ effect: 'NoSchedule' }],
      machinePoolId: state.modal.data.machinePool?.id,
    },
    machineTypes: state.machineTypes,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () =>
    dispatch(getMachineOrNodePools(ownProps.cluster.id, ownProps.isHypershiftCluster)),
  resetEditTaintsResponse: () => dispatch(clearScaleMachinePoolResponse(ownProps.cluster.id)),
  onSubmit: (formData) => {
    dispatch(
      editTaints(
        ownProps.cluster.id,
        formData.machinePoolId,
        { taints: parseReduxFormTaints(formData.taints) },
        ownProps.isHypershiftCluster,
      ),
    );
  },
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditTaints);
