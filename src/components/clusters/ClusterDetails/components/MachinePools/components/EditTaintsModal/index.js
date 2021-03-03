import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import EditTaintsModal from './EditTaintsModal';
import {
  getMachinePools,
  clearGetMachinePoolsResponse,
  clearScaleMachinePoolResponse,
  scaleMachinePool as editTaints,
} from '../../MachinePoolsActions';

import { closeModal } from '../../../../../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'editTaints',
};

const reduxFormEditTaints = reduxForm(reduxFormConfig)(EditTaintsModal);

const mapStateToProps = state => ({
  machinePoolsList: state.machinePools.getMachinePools,
  editTaintsResponse: state.machinePools.scaleMachinePoolResponse,
  initialValues: {
    taints: state.modal.data.machinePool?.taints || [{ effect: 'NoSchedule' }],
    machinePoolId: state.modal.data.machinePool?.id,
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () => dispatch(getMachinePools(ownProps.clusterId)),
  resetGetMachinePoolsResponse: () => dispatch(clearGetMachinePoolsResponse(ownProps.clusterId)),
  resetEditTaintsResponse: () => dispatch(clearScaleMachinePoolResponse(ownProps.clusterId)),
  onSubmit: (formData) => {
    dispatch(editTaints(
      ownProps.clusterId,
      formData.machinePoolId,
      { taints: formData.taints },
    ));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditTaints);
