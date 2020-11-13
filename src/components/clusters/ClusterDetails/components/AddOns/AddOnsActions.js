import get from 'lodash/get';
import AddOnsConstants from './AddOnsConstants';
import { clusterService } from '../../../../../services';

const getAddOns = () => dispatch => dispatch({
  type: AddOnsConstants.GET_ADDONS,
  payload: clusterService.getAddOns().then((response) => {
    const items = get(response, 'data.items', []);
    return ({
      items,
      resourceNames: items.map(addOn => addOn.resource_name),
      freeAddOns: items.filter(addOn => addOn.resource_cost === 0),
    });
  }),
});

const getClusterAddOns = clusterID => dispatch => dispatch({
  type: AddOnsConstants.GET_CLUSTER_ADDONS,
  payload: clusterService.getClusterAddOns(clusterID).then((response) => {
    const items = get(response, 'data.items', []);
    return ({
      clusterID,
      items,
    });
  }),
});

const addClusterAddOn = (clusterID, addOnData) => dispatch => dispatch({
  type: AddOnsConstants.ADD_CLUSTER_ADDON,
  payload: clusterService.addClusterAddOn(clusterID, addOnData),
});

const updateClusterAddOn = (clusterID, addOnID, addOnData) => dispatch => dispatch({
  type: AddOnsConstants.UPDATE_CLUSTER_ADDON,
  payload: clusterService.updateClusterAddOn(clusterID, addOnID, addOnData).then((response) => {
    dispatch(getClusterAddOns(clusterID));
    return response;
  }),
});

const clearClusterAddOnsResponses = () => ({
  type: AddOnsConstants.CLEAR_CLUSTER_ADDON_RESPONSES,
});


const addOnsActions = {
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  updateClusterAddOn,
  clearClusterAddOnsResponses,
};

export {
  addOnsActions,
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  updateClusterAddOn,
  clearClusterAddOnsResponses,
};
