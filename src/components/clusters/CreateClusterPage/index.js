import { connect } from 'react-redux';
import CreateClusterPage from './CreateClusterPage';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { hasOSDQuotaSelector } from '../common/quotaSelectors';
import { tollboothActions } from '../../../redux/actions';
import { ASSISTED_INSTALLER_FEATURE } from '../../../redux/constants/featureConstants';

const mapStateToProps = state => ({
  hasOSDQuota: hasOSDQuotaSelector(state),
  organization: state.userProfile.organization,
  token: state.tollbooth.token,
  assistedInstallerFeature: state.features[ASSISTED_INSTALLER_FEATURE],
});

const mapDispatchToProps = () => dispatch => ({
  openModal: () => dispatch(modalActions.openModal),
  getAuthToken: () => dispatch(tollboothActions.createAuthToken()),
  getOrganizationAndQuota: () => dispatch(getOrganizationAndQuota()),
});


export default connect(mapStateToProps, mapDispatchToProps)(CreateClusterPage);
