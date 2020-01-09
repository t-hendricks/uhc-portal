import { connect } from 'react-redux';
import get from 'lodash/get';

import { clearClusterResponse, editClusterConsoleURL } from '../../../../redux/actions/clustersActions';
import EditConsoleURLDialog from './EditConsoleURLDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import shouldShowModal from '../../../common/Modal/ModalSelectors';

const mapStateToProps = (state) => {
  const cluster = state.modal.data;
  return ({
    isOpen: shouldShowModal(state, 'edit-console-url'),
    editClusterResponse: state.clusters.editedCluster,
    clusterID: cluster.id,
    consoleURL: cluster.console_url || get(cluster, 'console.url', ''),
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (clusterID, consoleURL) => {
    let sanitizedURL = consoleURL;
    if (consoleURL.endsWith('/')) {
      sanitizedURL = consoleURL.substring(0, consoleURL.length - 1);
    }
    dispatch(editClusterConsoleURL(clusterID, sanitizedURL));
  },
  resetResponse: () => dispatch(clearClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditConsoleURLDialog);
