import get from 'lodash/get';
import { connect } from 'react-redux';

import { modalActions } from '../../../../../common/Modal/ModalActions';
import { canSubscribeOCPSelector } from '../../../../common/archived_do_not_use/EditSubscriptionSettingsDialog/canSubscribeOCPSelector';

import SubscriptionSettings from './SubscriptionSettings';

const mapStateToProps = (state) => ({
  canEdit: get(state, 'clusters.details.cluster.canEdit', false),
  canSubscribeOCP: canSubscribeOCPSelector(state),
  subscription: get(state, 'clusters.details.cluster.subscription', {}),
  isClusterDetailsPending: get(state, 'clusters.details.pending', false),
  isSubscriptionSettingsRequestPending: get(
    state,
    'subscriptionSettings.requestState.pending',
    false,
  ),
});

const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionSettings);
