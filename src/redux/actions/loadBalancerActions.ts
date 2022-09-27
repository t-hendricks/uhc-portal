import { loadBalancerConstants } from '../constants';
import { clusterService } from '../../services';

const getLoadBalancers = () =>
  clusterService
    .getLoadBalancerQuotaValues()
    .then((loadBalancersResponse) => loadBalancersResponse.data.items);

const getLoadBalancerValues = () => (dispatch) =>
  dispatch({
    type: loadBalancerConstants.GET_LOAD_BALANCER_VALUES,
    payload: getLoadBalancers(),
  });

export default getLoadBalancerValues;
