import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  clearHibernateClusterResponse,
  hibernateCluster,
} from '../../../../redux/actions/clustersActions';

import HibernateClusterModal from './HibernateClusterModal';
import { closeModal } from '../../../common/Modal/ModalActions';
import {
  getSchedules,
  clearPostedUpgradeScheduleResponse,
} from '../Upgrades/clusterUpgradeActions';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return {
    hibernateClusterResponse: state.clusters.hibernatingCluster,
    clusterID: modalData.clusterID ? modalData.clusterID : '',
    clusterName: modalData.clusterName ? modalData.clusterName : '',
    clusterUpgrades: state.clusterUpgrades.schedules,
    subscriptionID: modalData.subscriptionID ? modalData.subscriptionID : '',
    shouldDisplayClusterName: modalData.shouldDisplayClusterName || false,
  };
};

const mapDispatchToProps = (dispatch) => ({
  submit: (clusterID) => {
    dispatch(hibernateCluster(clusterID));
  },
  resetResponses: () => {
    dispatch(clearHibernateClusterResponse());
    dispatch(clearPostedUpgradeScheduleResponse());
  },
  getSchedules: (clusterID) => dispatch(getSchedules(clusterID)),
  closeModal: () => dispatch(closeModal()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HibernateClusterModal));
