import { connect } from 'react-redux';
import CreateCluster from './CreateCluster';
import { modalActions } from '../../common/Modal/ModalActions';
import hasQuota from '../../../common/quotaSelector';

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
