import { connect } from 'react-redux';
import CreateClusterPage from './CreateClusterPage';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import { hasOSDQuotaSelector, hasGcpQuotaSelector } from './quotaSelector';

const mapStateToProps = state => ({
  hasOSDQuota: hasOSDQuotaSelector(state),
  hasGcpQuota: hasGcpQuotaSelector(state),
  organization: state.userProfile.organization,
});

const mapDispatchToProps = {
  openModal: modalActions.openModal,
  getOrganizationAndQuota,
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateClusterPage);
