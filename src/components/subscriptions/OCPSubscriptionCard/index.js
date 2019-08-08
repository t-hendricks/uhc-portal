import { connect } from 'react-redux';

import { subscriptionsActions } from '../../../redux/actions/subscriptionsActions';
import OCPSubscriptionCard from './OCPSubscriptionCard';


const mapDispatchToProps = {
  fetchSubscriptions: params => subscriptionsActions.fetchSubscriptions(params),
};

function mapStateToProps(state) {
  return {
    subscriptions: state.subscriptions.subscriptions,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OCPSubscriptionCard);
