import { connect } from 'react-redux';
import get from 'lodash/get';

import { clearClusterResponse, editClusterDisplayName } from '../../../../redux/actions/clustersActions';
import EditDisplayNameDialog from './EditDisplayNameDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return ({
    editClusterResponse: state.clusters.editedCluster,
    clusterID: modalData.id,
    subscriptionID: get(modalData, 'subscription.id'),
    displayName: getClusterName(modalData),
    shouldDisplayClusterName: modalData.shouldDisplayClusterName || false,
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (subscriptionID, displayName) => {
    dispatch(editClusterDisplayName(subscriptionID, displayName));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDisplayNameDialog);
