import AddOnsConstants from './AddOnsConstants';
import { clusterService } from '../../../../../services';

const getAddOns = () => dispatch => dispatch({
  type: AddOnsConstants.GET_ADDONS,
  payload: clusterService.getAddOns().then(
    response => ({ addOns: response }),
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

const clearAddOnsResponses = () => ({
  type: AddOnsConstants.CLEAR_ADDON_RESPONSES,
});


const addOnsActions = {
  getAddOns,
  getClusterAddOns,
  addClusterAddOn,
  clearAddOnsResponses,
};

export default addOnsActions;
