import { connect } from 'react-redux';
import get from 'lodash/get';

import {
  clearClusterResponse,
  editClusterConsoleURL,
} from '../../../../redux/actions/clustersActions';
import EditConsoleURLDialog from './EditConsoleURLDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = (state) => {
  const cluster = state.modal.data;
  return {
    editClusterResponse: state.clusters.editedCluster,
    clusterID: cluster.id,
    subscriptionID: get(cluster, 'subscription.id'),
    consoleURL: cluster.console_url || get(cluster, 'console.url', ''),
    shouldDisplayClusterName: state.modal.data.shouldDisplayClusterName || false,
    clusterDisplayName: getClusterName(cluster),
  };
};

const mapDispatchToProps = (dispatch) => ({
  submit: (clusterID, subscriptionID, consoleURL) => {
    let sanitizedURL = consoleURL;
    if (consoleURL.endsWith('/')) {
      sanitizedURL = consoleURL.substring(0, consoleURL.length - 1);
    }
    dispatch(editClusterConsoleURL(clusterID, subscriptionID, sanitizedURL));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditConsoleURLDialog);
