import get from 'lodash/get';
import AddOnsConstants from './AddOnsConstants';
import { clusterService } from '../../../../../services';

// Add-ons provided as top-level products should be hidden from the tab
const hiddenAddOns = ['rhmi'];

const getAddOns = () => dispatch => dispatch({
  type: AddOnsConstants.GET_ADDONS,
  payload: clusterService.getAddOns().then((response) => {
    const items = get(response, 'data.items', []).filter(item => !hiddenAddOns.includes(item.id));
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
    const items = get(response, 'data.items', []).filter(item => !hiddenAddOns.includes(item.id));
    return ({
      clusterID,
      items,
    });
  }),
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
