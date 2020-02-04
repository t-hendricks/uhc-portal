import { connect } from 'react-redux';
import CreateClusterPage from './CreateClusterPage';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import hasQuota from '../../../common/quotaSelector';

export const mapDispatchToProps = {
  openModal: modalActions.openModal,
  getOrganizationAndQuota,
};

export function mapStateToProps(state) {
  return {
    hasQuota: hasQuota(state.userProfile.organization.quotaList.items || [], 'cluster.aws'),
    organization: state.userProfile.organization,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateClusterPage);
