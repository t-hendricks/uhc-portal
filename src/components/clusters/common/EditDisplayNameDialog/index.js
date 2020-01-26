import { connect } from 'react-redux';
import get from 'lodash/get';

import { clearClusterResponse, editClusterDisplayName } from '../../../../redux/actions/clustersActions';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-display-name'),
    editClusterResponse: state.clusters.editedCluster,
    clusterID: modalData.id,
    subscriptionID: get(modalData, 'subscription.id'),
    displayName: getClusterName(modalData),
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (clusterID, subscriptionID, displayName) => {
    dispatch(editClusterDisplayName(clusterID, subscriptionID, displayName));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDisplayNameDialog);
