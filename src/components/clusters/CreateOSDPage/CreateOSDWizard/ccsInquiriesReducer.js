import produce from 'immer';

import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import {
  VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  LIST_GCP_KEY_RINGS,
  LIST_GCP_KEYS,
  LIST_VPCS,
  CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES,
} from './ccsInquiriesActions';

const initialState = {
  ccsCredentialsValidity: {
    ...baseRequestState,
    cloudProvider: undefined,
    credentials: undefined,
  },
  gcpKeyRings: {
    ...baseRequestState,
    cloudProvider: undefined,
    credentials: undefined,
    keyLocation: undefined,
    data: undefined,
  },
  gcpKeys: {
    ...baseRequestState,
    cloudProvider: undefined,
    credentials: undefined,
    keyLocation: undefined,
    keyRing: undefined,
    data: undefined,
  },
  vpcs: {
    ...baseRequestState,
    cloudProvider: undefined,
    credentials: undefined,
    region: undefined,
    data: undefined,
  },
};

function ccsInquiriesReducer(state = initialState, action) {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case PENDING_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity.pending = true;
        break;
      case FULFILLED_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity = {
          ...initialState.ccsCredentialsValidity,
          fulfilled: true,
          credentials: action.meta?.credentials,
          cloudProvider: action.meta?.cloudProvider,
        };
        break;
      case REJECTED_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity = {
          ...initialState.ccsCredentialsValidity,
          ...getErrorState(action),
          credentials: action.meta?.credentials,
          cloudProvider: action.meta?.cloudProvider,
        };
        break;

      case PENDING_ACTION(LIST_GCP_KEY_RINGS):
        draft.gcpKeyRings.pending = true;
        break;
      case FULFILLED_ACTION(LIST_GCP_KEY_RINGS):
        draft.gcpKeyRings = {
          ...initialState.gcpKeyRings,
          fulfilled: true,
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
          data: action.payload.data,
        };
        break;
      case REJECTED_ACTION(LIST_GCP_KEY_RINGS):
        draft.gcpKeyRings = {
          ...initialState.gcpKeyRings,
          ...getErrorState(action),
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
          data: action.payload?.data,
        };
        break;

      case PENDING_ACTION(LIST_GCP_KEYS):
        draft.gcpKeys.pending = true;
        break;
      case FULFILLED_ACTION(LIST_GCP_KEYS):
        draft.gcpKeys = {
          ...initialState.gcpKeys,
          fulfilled: true,
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
          keyRing: action.meta?.keyRing,
          data: action.payload.data,
        };
        break;
      case REJECTED_ACTION(LIST_GCP_KEYS):
        draft.gcpKeys = {
          ...initialState.gcpKeys,
          ...getErrorState(action),
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
          keyRing: action.meta?.keyRing,
          data: action.payload.data,
        };
        break;

      case PENDING_ACTION(LIST_VPCS):
        draft.vpcs.pending = true;
        break;
      case FULFILLED_ACTION(LIST_VPCS):
        draft.vpcs = {
          ...initialState.vpcs,
          fulfilled: true,
          credentials: action.meta?.credentials,
          cloudProvider: action.meta?.cloudProvider,
          region: action.meta?.region,
          data: action.payload.data,
        };
        break;
      case REJECTED_ACTION(LIST_VPCS):
        draft.vpcs = {
          ...initialState.vpcs,
          ...getErrorState(action),
          credentials: action.meta?.credentials,
          cloudProvider: action.meta?.cloudProvider,
          region: action.meta?.region,
          data: action.payload?.data,
        };
        break;

      case CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES:
        return { ...initialState };
    }
  });
}

ccsInquiriesReducer.initialState = initialState;

export { initialState };

export default ccsInquiriesReducer;
