import { connect } from 'react-redux';

import { getSubscriptions } from '../../../redux/actions/subscriptionsActions';
import { viewConstants } from '../../../redux/constants';
import { openModal } from '../../common/Modal/ModalActions';

import ExpiredTrialsCard from './ExpiredTrialsCard';

const mapDispatchToProps = {
  getSubscriptions,
  openModal,
};

const mapStateToProps = (state) => ({
  subscriptions: state.subscriptions.subscriptions,
  viewOptions: state.viewOptions[viewConstants.OVERVIEW_EXPIRED_TRIALS],
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpiredTrialsCard);
