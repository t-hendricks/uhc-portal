import { action, ActionType } from 'typesafe-actions';

import { clusterService } from '../../services';
import { loadBalancerConstants } from '../constants';

const getLoadBalancers = () =>
  clusterService
    .getLoadBalancerQuotaValues()
    .then((loadBalancersResponse) => loadBalancersResponse.data.items);

const getLoadBalancerValues = () =>
  action(loadBalancerConstants.GET_LOAD_BALANCER_VALUES, getLoadBalancers());

export type LoadBalancerAction = ActionType<typeof getLoadBalancerValues>;

export default getLoadBalancerValues;
