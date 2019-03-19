import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { editCluster, clearClusterResponse } from '../../../../redux/actions/clustersActions';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const reduxFormConfig = {
  form: 'EditDisplayName',
};

const reduxFormEditDisplayName = reduxForm(reduxFormConfig)(EditDisplayNameDialog);

const mapStateToProps = (state) => {
  const modalData = state.modal.activeModal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-display-name'),
    editClusterResponse: state.clusters.editedCluster,
    initialFormValues: {
      id: modalData.id,
      displayName: modalData.display_name || modalData.name,
    },
  });
};

const mapDispatchToProps = dispatch => ({
  onSubmit: (formData) => {
    const clusterRequest = {
      display_name: formData.display_name,
    };
    dispatch(editCluster(formData.id, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormEditDisplayName);
