import PropTypes from 'prop-types';

import get from 'lodash/get';

import { normalizedProducts, billingModels } from '../../../common/subscriptionTypes';

function BillingModelLabel({ cluster }) {
  const planType = get(cluster, 'subscription.plan.type');
  const billingModel = get(cluster, 'billing_model');
  const { OSD, OSDTrial } = normalizedProducts;
  const { STANDARD, MARKETPLACE } = billingModels;
  const CCS = get(cluster, 'ccs.enabled');

  if (planType === OSDTrial) {
    return 'Free trial, upgradeable';
  }

  // OSD non-ccs standard quota
  if (planType === OSD && billingModel === STANDARD) {
    return 'Subscription (yearly)';
  }

  // OSD CCS marketplace
  if (planType === OSD && billingModel === MARKETPLACE && CCS) {
    return 'On-Demand (hourly)';
  }

  return 'Standard';
}

BillingModelLabel.propTypes = {
  cluster: PropTypes.shape({
    product: PropTypes.shape({
      type: PropTypes.oneOf(Object.values(normalizedProducts)).isRequired,
    }),
  }),
};

export default BillingModelLabel;
