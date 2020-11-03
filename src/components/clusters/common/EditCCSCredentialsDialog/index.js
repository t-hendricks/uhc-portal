import { connect } from 'react-redux';

import get from 'lodash/get';
import EditCCSCredentialsDialog from './EditCCSCredentialsDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';
import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';


const mapStateToProps = (state) => {
  const cluster = state.modal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-ccs-credentials'),
    editClusterResponse: state.clusters.editedCluster,
    clusterID: cluster.id,
    awsAccountID: get(cluster, 'aws.account_id', ''),
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (clusterID, formData) => {
    const clusterRequest = {
      aws: {
        access_key_id: formData.awsaccesskeyid,
        secret_access_key: formData.awssecretaccesskey,
      },
    };
    dispatch(editCluster(clusterID, clusterRequest));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditCCSCredentialsDialog);
