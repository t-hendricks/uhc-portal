import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import EditLabelsModal from './EditLabelsModal';
import {
  getMachineOrNodePools,
  clearScaleMachinePoolResponse,
  patchMachinePoolOrNodePool as editLabels,
} from '../../MachinePoolsActions';

import { clearClusterResponse } from '../../../../../../../redux/actions/clustersActions';

import { parseLabels, parseTags } from '../../machinePoolsHelper';

import { closeModal } from '../../../../../../common/Modal/ModalActions';

const reduxFormConfig = {
  form: 'editLabels',
};

const reduxFormEditLabels = reduxForm(reduxFormConfig)(EditLabelsModal);

const valueSelector = formValueSelector('editLabels');

const mapStateToProps = (state) => {
  const currentLabels = state.modal.data.machinePool?.labels;

  return {
    machinePoolsList: state.machinePools.getMachinePools,
    editLabelsResponse: state.machinePools.scaleMachinePoolResponse,
    tags: valueSelector(state, 'labels') || parseLabels(currentLabels),
    selectedMachinePoolId:
      valueSelector(state, 'machinePoolId') || state.modal.data.machinePool?.id,
    initialValues: {
      labels: parseLabels(currentLabels),
      machinePoolId: state.modal.data.machinePool?.id,
    },
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  closeModal: () => dispatch(closeModal()),
  getMachinePools: () =>
    dispatch(getMachineOrNodePools(ownProps.clusterId, ownProps.isHypershiftCluster)),
  resetEditLabelsResponse: () => dispatch(clearScaleMachinePoolResponse(ownProps.clusterId)),
  resetDefaultMachinePoolEditLabelsResponse: () => dispatch(clearClusterResponse()),
  onSubmit: (formData) =>
    dispatch(
      editLabels(ownProps.clusterId, formData.machinePoolId, {
        labels: parseTags(formData.labels),
      }),
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditLabels);
