import { action, ActionType } from 'typesafe-actions';
import { flavourConstants } from '../constants';
import { clusterService } from '../../services';

// Backend API supports multiple flavours but presently all managed clusters
// use same flavour 'osd-4'.  Save a bit of traffic by fetching only it.
export const DEFAULT_FLAVOUR_ID = 'osd-4';

export const getDefaultFlavour = () =>
  action(flavourConstants.GET_DEFAULT_FLAVOUR, clusterService.getFlavour(DEFAULT_FLAVOUR_ID));

export type FlavourAction = ActionType<typeof getDefaultFlavour>;
