import { connect } from 'react-redux';

import {
  clearUpgradeTrialClusterResponse,
  upgradeTrialCluster,
} from '../../../../redux/actions/clustersActions';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';
import getClusterName from '../../../../common/getClusterName';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return ({
    upgradeTrialClusterResponse: state.clusters.upgradedCluster,
    organization: state.userProfile.organization,
    clusterID: modalData.clusterID ? modalData.clusterID : '',
    cluster: modalData.cluster ? modalData.cluster : '',
    clusterDisplayName: getClusterName(modalData.cluster),
    shouldDisplayClusterName: modalData.shouldDisplayClusterName,
    machineTypesByID: state.machineTypes.typesByID,
  });
};

const mapDispatchToProps = dispatch => ({
  submit: (clusterID, billingModel) => {
    dispatch(upgradeTrialCluster(clusterID, {
      billing_model: billingModel,
      product: {
        id: 'osd',
      },
    }));
  },
  resetResponse: () => dispatch(clearUpgradeTrialClusterResponse()),
  closeModal: () => dispatch(closeModal()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeTrialClusterDialog);
