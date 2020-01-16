import get from 'lodash/get';
import moment from 'moment';

import { entitlementStatuses } from './subscriptionTypes';

const getClusterEvaluationExpiresDate = cluster => (
  get(cluster, 'subscription.entitlement_status', false) === entitlementStatuses.SIXTY_DAY_EVALUATION
    ? moment(cluster.creation_timestamp).add(60, 'days').format('MMMM Do, YYYY')
    : null
);

export default getClusterEvaluationExpiresDate;
