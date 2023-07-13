import { connect } from 'react-redux';
import { featureGateSelector } from '~/hooks/useFeatureGate';
import CreateClusterPage from './CreateClusterPage';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { normalizedProducts } from '../../../common/subscriptionTypes';
import { hasManagedQuotaSelector } from '../common/quotaSelectors';
import { tollboothActions } from '../../../redux/actions';
import {
  OSD_TRIAL_FEATURE,
  ASSISTED_INSTALLER_FEATURE,
} from '../../../redux/constants/featureConstants';

const mapStateToProps = (state) => ({
  hasOSDQuota: hasManagedQuotaSelector(state, normalizedProducts.OSD),
  hasOSDTrialQuota: hasManagedQuotaSelector(state, normalizedProducts.OSDTrial),
  organization: state.userProfile.organization,
  token: state.tollbooth.token,
  osdTrialFeature: featureGateSelector(state, OSD_TRIAL_FEATURE),
  assistedInstallerFeature: featureGateSelector(state, ASSISTED_INSTALLER_FEATURE),
});

const mapDispatchToProps = () => (dispatch) => ({
  openModal: () => dispatch(modalActions.openModal),
  getAuthToken: () => dispatch(tollboothActions.createAuthToken()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateClusterPage);
