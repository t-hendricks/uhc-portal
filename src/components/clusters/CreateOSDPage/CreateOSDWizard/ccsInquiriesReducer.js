import produce from 'immer';

import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../../../../redux/reduxHelpers';
import { getErrorState } from '../../../../common/errors';
import {
  VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  LIST_GCP_KEY_RINGS,
  LIST_GCP_KEYS,
  LIST_VPCS,
  CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES,
  CLEAR_CCS_CREDENTIALS_INQUIRY,
} from './ccsInquiriesActions';

export const initialState = {
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
    data: {
      items: [],
    },
  },
  gcpKeys: {
    ...baseRequestState,
    cloudProvider: undefined,
    credentials: undefined,
    keyLocation: undefined,
    keyRing: undefined,
    data: {
      items: [],
    },
  },
  vpcs: {
    ...baseRequestState,
    cloudProvider: undefined,
    credentials: undefined,
    region: undefined,
    data: {
      bySubnetID: {},
      items: [],
    },
  },
};

/**
 * Indexes AWS VPC subnet details by subnet_id.
 * @param vpcsData - contains items: [
 *   { name, aws_subnets: [ { subnet_id, public, availability_zone }, ...] },
 *   ...
 * ]
 * @returns { [subnet_id]: { vpc_id, vpc_name, subnet_id, name, public, availability_zone } }
 */
const indexAWSVPCs = (vpcsData) => {
  const bySubnetID = {};
  vpcsData.items.forEach((vpcItem) => {
    let vpcId = vpcItem.id;
    let vpcName = vpcItem.name;
    if (!vpcItem.id) {
      // Compatibility to older API returning only id, in `name` field.
      vpcId = vpcItem.name;
      vpcName = undefined;
    }
    // Work around backend currently returning empty aws_subnets as null.
    (vpcItem.aws_subnets || []).forEach((subnet) => {
      bySubnetID[subnet.subnet_id] = { ...subnet, vpc_id: vpcId, vpc_name: vpcName };
    });
  });
  return bySubnetID;
};

/** Enriches response with .bySubnetID entry. */
export const processAWSVPCs = (vpcsData) => ({ ...vpcsData, bySubnetID: indexAWSVPCs(vpcsData) });

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
      case CLEAR_CCS_CREDENTIALS_INQUIRY:
        return {
          ...state,
          ccsCredentialsValidity: {
            ...initialState.ccsCredentialsValidity,
          },
        };
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
      case FULFILLED_ACTION(LIST_VPCS): {
        let { data } = action.payload;
        if (action.meta?.cloudProvider === 'aws') {
          data = processAWSVPCs(data);
        }
        draft.vpcs = {
          ...initialState.vpcs,
          fulfilled: true,
          credentials: action.meta?.credentials,
          cloudProvider: action.meta?.cloudProvider,
          region: action.meta?.region,
          data,
        };
        break;
      }
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

export default ccsInquiriesReducer;
