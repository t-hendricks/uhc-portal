import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import AddMachinePoolModal from './AddMachinePoolModal';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../../../redux/actions/userActions';
import { addMachinePool, clearAddMachinePoolResponse } from '../../MachinePoolsActions';

import { hasLabelsInput, parseReduxFormKeyValueList } from '../../../../../../../common/helpers';

const reduxFormConfig = {
  form: 'AddMachinePool',
};
const reduxFormAddMachinePool = reduxForm(reduxFormConfig)(AddMachinePoolModal);

const mapStateToProps = state => ({
  addMachinePoolResponse: state.machinePools.addMachinePoolResponse,
  machineTypes: state.machineTypes,
  organization: state.userProfile.organization,
  initialValues: {
    name: '',
    nodes_compute: '0',
    node_labels: [{}],
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const machinePoolRequest = {
      id: formData.name,
      replicas: parseInt(formData.nodes_compute, 10),
      instance_type: formData.machine_type,
    };
    if (hasLabelsInput(formData.node_labels)) {
      machinePoolRequest.labels = parseReduxFormKeyValueList(formData.node_labels);
    }
    dispatch(addMachinePool(ownProps.cluster.id, machinePoolRequest));
  },
  clearAddMachinePoolResponse: () => dispatch(clearAddMachinePoolResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAddMachinePool);
