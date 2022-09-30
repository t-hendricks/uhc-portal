import { action, ActionType } from 'typesafe-actions';
import { loadBalancerConstants } from '../constants';
import { clusterService } from '../../services';
import type { AppThunk } from '../types';

const getLoadBalancers = () =>
  clusterService
    .getLoadBalancerQuotaValues()
    .then((loadBalancersResponse) => loadBalancersResponse.data.items);

const getLoadBalancerValuesAction = () =>
  action(loadBalancerConstants.GET_LOAD_BALANCER_VALUES, getLoadBalancers());

const getLoadBalancerValues = (): AppThunk => (dispatch) => dispatch(getLoadBalancerValuesAction());

export type LoadBalancerAction = ActionType<typeof getLoadBalancerValuesAction>;

export default getLoadBalancerValues;
