import { connect } from 'react-redux';
import { get } from 'lodash';

import { modalActions } from '../../../../../common/Modal/ModalActions';
import SubscriptionSettings from './SubscriptionSettings';


function mapStateToProps(state) {
  const canEdit = get(state, 'clusters.details.cluster.canEdit', false);
  const subscription = get(state, 'clusters.details.cluster.subscription', {});
  return {
    canEdit,
    subscription,
  };
}

const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionSettings);
