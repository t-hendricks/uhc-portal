import { connect } from 'react-redux';

import { subscriptionsActions } from '../../../redux/actions/subscriptionsActions';
import OSDSubscriptionCard from './OSDSubscriptionCard';

import { MARKETPLACE_QUOTA_FEATURE } from '../../../redux/constants/featureConstants';

const mapDispatchToProps = {
  fetchQuotaCost: organizationID => subscriptionsActions.fetchQuotaCost(organizationID),
};

function mapStateToProps(state) {
  return {
    quotaCost: state.subscriptions.quotaCost,
    marketplaceQuotaFeature: state.features[MARKETPLACE_QUOTA_FEATURE],
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OSDSubscriptionCard);
