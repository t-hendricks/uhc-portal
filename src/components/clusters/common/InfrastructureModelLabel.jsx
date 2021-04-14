import PropTypes from 'prop-types';

import get from 'lodash/get';

import { normalizedProducts } from '../../../common/subscriptionTypes';

function InfrastructureModelLabel({ cluster }) {
  const planId = get(cluster, 'subscription.plan.id');
  const { ROSA, OSD } = normalizedProducts;
  const CCS = get(cluster, 'ccs.enabled');

  if (planId === ROSA) {
    return 'Through AWS';
  }

  if (CCS) {
    return 'Customer cloud subscription';
  }

  if (planId === OSD && !CCS) {
    return 'Red Hat cloud account';
  }

  return 'Standard';
}

InfrastructureModelLabel.propTypes = {
  cluster: PropTypes.shape({
    product: PropTypes.shape({
      id: PropTypes.oneOf(Object.keys(normalizedProducts)).isRequired,
    }),
  }),
};

export default InfrastructureModelLabel;
