import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import AddMachinePoolModal from './AddMachinePoolModal';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../../../redux/actions/userActions';
import { addMachinePool, clearAddMachinePoolResponse } from '../../MachinePoolsActions';

import { parseReduxFormKeyValueList, parseReduxFormTaints } from '../../../../../../../common/helpers';

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
    taints: [{ effect: 'NoSchedule' }],
  },
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const machinePoolRequest = {
      id: formData.name,
      replicas: parseInt(formData.nodes_compute, 10),
      instance_type: formData.machine_type,
    };

    const parsedLabels = parseReduxFormKeyValueList(formData.node_labels);
    const parsedTaints = parseReduxFormTaints(formData.taints);

    if (!isEmpty(parsedLabels)) {
      machinePoolRequest.labels = parseReduxFormKeyValueList(formData.node_labels);
    }

    if (parsedTaints.length > 0) {
      machinePoolRequest.taints = parsedTaints;
    }

    dispatch(addMachinePool(ownProps.cluster.id, machinePoolRequest));
  },
  clearAddMachinePoolResponse: () => dispatch(clearAddMachinePoolResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
  getMachineTypes: () => dispatch(getMachineTypes()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAddMachinePool);
