import { connect } from 'react-redux';

import { subscriptionsActions } from '../../../redux/actions/subscriptionsActions';
import OSDSubscriptionCard from './OSDSubscriptionCard';


const mapDispatchToProps = {
  fetchQuotaSummary: organizationID => subscriptionsActions.fetchQuotaSummary(organizationID),
};

function mapStateToProps(state) {
  return {
    quotaSummary: state.subscriptions.quotaSummary,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OSDSubscriptionCard);
