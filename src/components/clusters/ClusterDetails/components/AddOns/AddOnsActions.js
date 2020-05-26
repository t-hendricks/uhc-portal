import AddOnsConstants from './AddOnsConstants';
import { clusterService } from '../../../../../services';

const getAddOns = () => dispatch => dispatch({
  type: AddOnsConstants.GET_ADDONS,
  payload: clusterService.getAddOns().then(
    response => ({
      addOns: response,
      resourceNames: response.data.items.map(addOn => addOn.resource_name),
      freeAddOns: response.data.items.filter(addOn => addOn.resource_cost === 0),
    }),
  ),
});

const getClusterAddOns = clusterID => dispatch => dispatch({
  type: AddOnsConstants.GET_CLUSTER_ADDONS,
  payload: clusterService.getClusterAddOns(clusterID).then(
    response => ({ clusterID, clusterAddOns: response }),
  ),
});

const addClusterAddOn = (clusterID, addOnID) => dispatch => dispatch({
  type: AddOnsConstants.ADD_CLUSTER_ADDON,
  payload: clusterService.addClusterAddOn(clusterID, addOnID),
});

const clearClusterAddOnsResponses = () => ({
  type: AddOnsConstants.CLEAR_CLUSTER_ADDON_RESPONSES,
});


const addOnsActions = {
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  clearClusterAddOnsResponses,
};

export {
  addOnsActions,
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  clearClusterAddOnsResponses,
};
