import PropTypes from 'prop-types';

import get from 'lodash/get';

import { normalizedProducts } from '../../../common/subscriptionTypes';

function BillingModelLabel({ cluster }) {
  if (get(cluster, 'subscription.plan.id') === normalizedProducts.ROSA) {
    return 'Through AWS';
  }
  if (get(cluster, 'ccs.enabled')) {
    return 'Customer cloud subscription';
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
