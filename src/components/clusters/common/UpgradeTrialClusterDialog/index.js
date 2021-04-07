import { connect } from 'react-redux';

import {
  clearUpgradeTrialClusterResponse,
  upgradeTrialCluster,
} from '../../../../redux/actions/clustersActions';
import { getOrganizationAndQuota } from '../../../../redux/actions/userActions';
import { MARKETPLACE_QUOTA_FEATURE } from '../../../../redux/constants/featureConstants';
import UpgradeTrialClusterDialog from './UpgradeTrialClusterDialog';
import { closeModal } from '../../../common/Modal/ModalActions';

const mapStateToProps = (state) => {
  const modalData = state.modal.data;
  return ({
    upgradeTrialClusterResponse: state.clusters.upgradedCluster,
    organization: state.userProfile.organization,
    clusterID: modalData.clusterID ? modalData.clusterID : '',
    cluster: modalData.cluster ? modalData.cluster : '',
    name: modalData.name ? modalData.name : '',
    machineTypesByID: state.machineTypes.typesByID,
    marketplaceQuotaFeature: state.features[MARKETPLACE_QUOTA_FEATURE],
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
