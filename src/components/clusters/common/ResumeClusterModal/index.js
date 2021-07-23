import { connect } from 'react-redux';

import {
  clearResumeClusterResponse,
  resumeCluster,
} from '../../../../redux/actions/clustersActions';

import ResumeClusterModal from './ResumeClusterModal';
import { closeModal } from '../../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return ({
    resumeClusterResponse: state.clusters.resumeHibernatingCluster,
    clusterID: modalData.clusterID ? modalData.clusterID : '',
    clusterName: modalData.clusterName ? modalData.clusterName : '',
    shouldDisplayClusterName: modalData.shouldDisplayClusterName || false,
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (clusterID) => {
    dispatch(resumeCluster(clusterID));
  },
  resetResponse: () => dispatch(clearResumeClusterResponse()),
  closeModal: () => dispatch(closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResumeClusterModal);
