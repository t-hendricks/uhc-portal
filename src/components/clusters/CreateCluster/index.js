import { connect } from 'react-redux';
import CreateCluster from './CreateCluster';
import { modalActions } from '../../common/Modal/ModalActions';

export const hasQuota = quotas => quotas.some(quota => quota.allowed - quota.reserved > 0);

export const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export function mapStateToProps(state) {
  const { quota } = state.userProfile;

  return {
    hasQuota: hasQuota(quota.quotaList.items || []),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateCluster);
