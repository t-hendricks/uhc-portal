import { connect } from 'react-redux';
import CreateCluster from './CreateCluster';
import { modalActions } from '../../common/Modal/ModalActions';
import { userActions } from '../../../redux/actions/userActions';
import hasQuota from '../../../common/quotaSelector';

export const mapDispatchToProps = {
  openModal: modalActions.openModal,
  getQuota: orgID => userActions.fetchOrganizationQuota(orgID),
  getOrganization: userActions.getOrganization,
};

export function mapStateToProps(state) {
  const { quota } = state.userProfile;

  return {
    hasQuota: hasQuota(quota.quotaList.items || []),
    organization: state.userProfile.organization,
    quota,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCluster);
