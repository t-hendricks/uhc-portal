import { action, ActionType } from 'typesafe-actions';
import { loadBalancerConstants } from '../constants';
import { clusterService } from '../../services';

const getLoadBalancers = () =>
  clusterService
    .getLoadBalancerQuotaValues()
    .then((loadBalancersResponse) => loadBalancersResponse.data.items);

const getLoadBalancerValues = () =>
  action(loadBalancerConstants.GET_LOAD_BALANCER_VALUES, getLoadBalancers());

export type LoadBalancerAction = ActionType<typeof getLoadBalancerValues>;

export default getLoadBalancerValues;
