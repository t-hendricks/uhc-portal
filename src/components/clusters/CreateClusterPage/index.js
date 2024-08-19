import { connect } from 'react-redux';

import { featureGateSelector } from '~/hooks/useFeatureGate';

import { normalizedProducts } from '../../../common/subscriptionTypes';
import { tollboothActions } from '../../../redux/actions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { ASSISTED_INSTALLER_FEATURE } from '../../../redux/constants/featureConstants';
import { modalActions } from '../../common/Modal/ModalActions';
import { hasManagedQuotaSelector } from '../common/quotaSelectors';

import CreateClusterPage from './CreateClusterPage';

const mapStateToProps = (state) => ({
  hasOSDQuota: hasManagedQuotaSelector(
    state.userProfile.organization.quotaList,
    normalizedProducts.OSD,
  ),
  hasOSDTrialQuota: hasManagedQuotaSelector(
    state.userProfile.organization.quotaList,
    normalizedProducts.OSDTRIAL,
  ),
  organization: state.userProfile.organization,
  token: state.tollbooth.token,
  assistedInstallerFeature: featureGateSelector(state, ASSISTED_INSTALLER_FEATURE),
});

const mapDispatchToProps = () => (dispatch) => ({
  openModal: () => dispatch(modalActions.openModal),
  getAuthToken: () => dispatch(tollboothActions.createAuthToken()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateClusterPage);
