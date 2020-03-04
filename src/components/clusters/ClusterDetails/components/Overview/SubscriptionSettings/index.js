import { connect } from 'react-redux';
import { get } from 'lodash';

import { modalActions } from '../../../../../common/Modal/ModalActions';
import SubscriptionSettings from './SubscriptionSettings';


const mapStateToProps = state => ({
  canEdit: get(state, 'clusters.details.cluster.canEdit', false),
  subscription: get(state, 'clusters.details.cluster.subscription', {}),
});

const mapDispatchToProps = {
  openModal: modalActions.openModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionSettings);
