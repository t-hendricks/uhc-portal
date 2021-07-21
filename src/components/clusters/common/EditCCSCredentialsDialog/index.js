import { connect } from 'react-redux';

import get from 'lodash/get';
import EditCCSCredentialsDialog from './EditCCSCredentialsDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import { clearClusterResponse, editCluster } from '../../../../redux/actions/clustersActions';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = (state) => {
  const cluster = state.modal.data;
  return ({
    editClusterResponse: state.clusters.editedCluster,
    clusterID: cluster.id,
    awsAccountID: get(cluster, 'aws.account_id', ''),
    clusterDisplayName: getClusterName(cluster),
    shouldDisplayClusterName: getClusterName(cluster),
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
