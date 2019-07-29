import { connect } from 'react-redux';
import CreateCluster from './CreateCluster';
import { modalActions } from '../../common/Modal/ModalActions';
import { getOrganizationAndQuota } from '../../../redux/actions/userActions';
import hasQuota from '../../../common/quotaSelector';

export const mapDispatchToProps = {
  openModal: modalActions.openModal,
  getOrganizationAndQuota,
};

export function mapStateToProps(state) {
  const { quota } = state.userProfile;

  return {
    hasQuota: hasQuota(quota.quotaList.items || []),
    organization: state.userProfile.organization,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCluster);
