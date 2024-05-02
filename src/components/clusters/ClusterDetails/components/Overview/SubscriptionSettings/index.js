import get from 'lodash/get';
import { connect } from 'react-redux';

import { modalActions } from '../../../../../common/Modal/ModalActions';
import canSubscribeOCPSelector from '../../../../common/EditSubscriptionSettingsDialog/CanSubscribeOCPSelector';

import SubscriptionSettings from './SubscriptionSettings';

const mapStateToProps = (state) => ({
  canEdit: get(state, 'clusters.details.cluster.canEdit', false),
  canSubscribeOCP: canSubscribeOCPSelector(state),
  subscription: get(state, 'clusters.details.cluster.subscription', {}),
});

const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionSettings);
