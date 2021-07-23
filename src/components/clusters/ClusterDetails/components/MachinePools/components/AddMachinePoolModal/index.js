import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import isEmpty from 'lodash/isEmpty';

import AddMachinePoolModal from './AddMachinePoolModal';
import { canAutoScaleSelector } from '../../MachinePoolsSelectors';
import { closeModal } from '../../../../../../common/Modal/ModalActions';
import { getMachineTypes } from '../../../../../../../redux/actions/machineTypesActions';
import { getOrganizationAndQuota } from '../../../../../../../redux/actions/userActions';
import { addMachinePool, clearAddMachinePoolResponse } from '../../MachinePoolsActions';

import { parseReduxFormKeyValueList, parseReduxFormTaints } from '../../../../../../../common/helpers';

const reduxFormConfig = {
  form: 'AddMachinePool',
};
const reduxFormAddMachinePool = reduxForm(reduxFormConfig)(AddMachinePoolModal);

const mapStateToProps = (state, ownProps) => {
  const valueSelector = formValueSelector('AddMachinePool');

  return ({
    addMachinePoolResponse: state.machinePools.addMachinePoolResponse,
    machineTypes: state.machineTypes,
    organization: state.userProfile.organization,
    autoscalingEnabled: !!valueSelector(state, 'autoscalingEnabled'),
    autoScaleMinNodesValue: valueSelector(state, 'min_replicas'),
    autoScaleMaxNodesValue: valueSelector(state, 'max_replicas'),
    canAutoScale: canAutoScaleSelector(state, ownProps.cluster.subscription.plan.type),
    initialValues: {
      name: '',
      nodes_compute: '0',
      node_labels: [{}],
      taints: [{ effect: 'NoSchedule' }],
    },
  });
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSubmit: (formData) => {
    const machinePoolRequest = {
      id: formData.name,
      instance_type: formData.machine_type,
    };

    if (formData.autoscalingEnabled) {
      const minNodes = parseInt(formData.min_replicas, 10);
      const maxNodes = parseInt(formData.max_replicas, 10);
      const isMultiAz = ownProps.cluster.multi_az;

      machinePoolRequest.autoscaling = {
        min_replicas: isMultiAz ? minNodes * 3 : minNodes,
        max_replicas: isMultiAz ? maxNodes * 3 : maxNodes,
      };
    } else {
      machinePoolRequest.replicas = parseInt(formData.nodes_compute, 10);
    }

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
