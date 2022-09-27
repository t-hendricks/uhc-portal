import { flavourConstants } from '../constants';
import { clusterService } from '../../services';

// Backend API supports multiple flavours but presently all managed clusters
// use same flavour 'osd-4'.  Save a bit of traffic by fetching only it.
export const DEFAULT_FLAVOUR_ID = 'osd-4';

export const getDefaultFlavour = () => ({
  type: flavourConstants.GET_DEFAULT_FLAVOUR,
  payload: clusterService.getFlavour(DEFAULT_FLAVOUR_ID),
});
