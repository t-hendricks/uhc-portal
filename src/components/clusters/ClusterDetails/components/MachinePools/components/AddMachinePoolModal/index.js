import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import AddMachinePoolModal from './AddMachinePoolModal';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../../../redux/actions/userActions';
import { addMachinePool, clearAddMachinePoolResponse } from '../../MachinePoolsActions';

import { strToCleanObject } from '../../../../../../../common/helpers';

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
    nodes_compute: '4',
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const machinePoolRequest = {
      id: formData.name,
      replicas: parseInt(formData.nodes_compute, 10),
      instance_type: formData.machine_type,
      labels: strToCleanObject(formData.node_labels, '='),
    };
    dispatch(addMachinePool(ownProps.cluster.id, machinePoolRequest));
  },
  clearAddMachinePoolResponse: () => dispatch(clearAddMachinePoolResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAddMachinePool);
