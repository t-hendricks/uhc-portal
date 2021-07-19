import PropTypes from 'prop-types';

import get from 'lodash/get';

import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';

function BillingModelLabel({ cluster }) {
  const planId = get(cluster, 'subscription.plan.type');
  const billingModel = get(cluster, 'billing_model');
  const { ROSA, OSD, OSDTrial } = normalizedProducts;
  const { STANDARD, MARKETPLACE } = billingModels;
  const CCS = get(cluster, 'ccs.enabled');

  if (planId === ROSA) {
    return 'Through AWS';
  }

  if (planId === OSDTrial) {
    return 'Free trial, upgradeable';
  }

  // OSD non-ccs standard quota
  if (planId === OSD && billingModel === STANDARD) {
    return 'Subscription (yearly)';
  }

  // OSD CCS marketplace
  if (planId === OSD && billingModel === MARKETPLACE && CCS) {
    return 'On-demand (hourly)';
  }

  return 'Standard';
}

BillingModelLabel.propTypes = {
  cluster: PropTypes.shape({
    product: PropTypes.shape({
      id: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
    }),
  }),
};

export default BillingModelLabel;
