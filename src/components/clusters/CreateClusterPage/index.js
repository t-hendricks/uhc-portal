import { connect } from 'react-redux';
import CreateClusterPage from './CreateClusterPage';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import hasOSDQuota from './quotaSelector';

const mapStateToProps = state => ({
  hasOSDQuota: hasOSDQuota(state),
  organization: state.userProfile.organization,
});

const mapDispatchToProps = () => ({
  openModal: modalActions.openModal,
  getOrganizationAndQuota,
});


export default connect(mapStateToProps, mapDispatchToProps)(CreateClusterPage);
