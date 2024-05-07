import get from 'lodash/get';
import PropTypes from 'prop-types';

import { normalizedProducts } from '../../../common/subscriptionTypes';

function InfrastructureModelLabel({ cluster }) {
  const planType = get(cluster, 'subscription.plan.type');
  const { OSD } = normalizedProducts;
  const CCS = get(cluster, 'ccs.enabled');

  if (CCS) {
    return 'Customer cloud subscription';
  }

  if (planType === OSD) {
    // CCS could be 'undefined' for archived clusters
    if (CCS === false) {
      return 'Red Hat cloud account';
    }
    return 'N/A';
  }

  return 'Standard';
}

InfrastructureModelLabel.propTypes = {
  cluster: PropTypes.shape({
    subscription: PropTypes.shape({
      plan: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(normalizedProducts)).isRequired,
      }),
    }),
  }),
};

export default InfrastructureModelLabel;
