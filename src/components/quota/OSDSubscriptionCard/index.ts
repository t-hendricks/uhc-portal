import { connect } from 'react-redux';

import { subscriptionsActions } from '../../../redux/actions/subscriptionsActions';
import OSDSubscriptionCard from './OSDSubscriptionCard';

const mapDispatchToProps = {
  fetchQuotaCost: (organizationID) => subscriptionsActions.fetchQuotaCost(organizationID),
};

function mapStateToProps(state) {
  return {
    quotaCost: state.subscriptions.quotaCost,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OSDSubscriptionCard);
