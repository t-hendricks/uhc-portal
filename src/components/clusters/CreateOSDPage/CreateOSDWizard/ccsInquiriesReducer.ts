import produce from 'immer';

import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '~/redux/reduxHelpers';
import type { PromiseActionType, PromiseReducerState } from '~/redux/types';

import { getErrorState } from '~/common/errors';
import {
  VALIDATE_CLOUD_PROVIDER_CREDENTIALS,
  LIST_GCP_KEY_RINGS,
  LIST_GCP_KEYS,
  LIST_VPCS,
  CLEAR_LIST_VPCS,
  CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES,
  CLEAR_CCS_CREDENTIALS_INQUIRY,
  InquiriesAction,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import { CloudVPC, EncryptionKey, KeyRing } from '~/types/clusters_mgmt.v1';
import { AugmentedSubnetwork, AWSCredentials } from '~/types/types';

// Credentials are only stored here as part of metadata on requests,
// to allow checking whether existing data is relevant.
// For GCP, it happened to be easier in the actions to store the unparsed JSON;
// this is not a critical choice, as long as it's comparable.
type GCPCredentialsJSON = string;

export type State = {
  ccsCredentialsValidity: PromiseReducerState<{
    cloudProvider?: string;
    credentials?: AWSCredentials | GCPCredentialsJSON;
  }>;
  gcpKeyRings: PromiseReducerState<{
    cloudProvider?: string;
    credentials?: GCPCredentialsJSON;
    keyLocation?: string;
    data: {
      items: KeyRing[];
    };
  }>;
  gcpKeys: PromiseReducerState<{
    cloudProvider?: string;
    credentials?: GCPCredentialsJSON;
    keyLocation?: string;
    keyRing?: string;
    data: {
      items: EncryptionKey[];
    };
  }>;
  vpcs: PromiseReducerState<{
    credentials?: AWSCredentials | GCPCredentialsJSON;
    cloudProvider?: string;
    region?: string;
    subnet?: string; // if set on request, only VPC connected to that subnet were listed.
    data: {
      items: CloudVPC[];
      // populated for AWS, will be {} otherwise.
      bySubnetID: Record<string, AugmentedSubnetwork>;
    };
  }>;
};

const initialState: State = {
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
 */
export const indexAWSVPCs = (vpcsData: {
  items?: CloudVPC[];
}): Record<string, AugmentedSubnetwork> => {
  const bySubnetID = {} as Record<string, AugmentedSubnetwork>;
  (vpcsData.items || []).forEach((vpcItem) => {
    // Work around backend currently returning empty aws_subnets as null.
    (vpcItem.aws_subnets || []).forEach((subnet) => {
      // for type safety but expected to always be present
      if (subnet.subnet_id) {
        // Note: `aws_inquiries/vpcs` returns VPC `.id` (and optionally `.name`),
        // while `gcp_inquiries/vpcs` returns VPC `.name`.  But this function deals with AWS.
        bySubnetID[subnet.subnet_id] = { ...subnet, vpc_id: vpcItem.id!, vpc_name: vpcItem.name };
      }
    });
  });
  return bySubnetID;
};

/** Enriches response with .bySubnetID entry. */
export const processAWSVPCs = (vpcsData: { items: CloudVPC[] }) => ({
  ...vpcsData,
  bySubnetID: indexAWSVPCs(vpcsData),
});

function ccsInquiriesReducer(
  state: State = initialState,
  action: PromiseActionType<InquiriesAction>,
): State {
  // eslint-disable-next-line consistent-return
  return produce(state, (draft: State) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case PENDING_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity.pending = true;
        break;
      case FULFILLED_ACTION(VALIDATE_CLOUD_PROVIDER_CREDENTIALS):
        draft.ccsCredentialsValidity = {
          ...baseRequestState,
          fulfilled: true,
          credentials: action.meta.credentials,
          cloudProvider: action.meta.cloudProvider,
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
          ...baseRequestState,
          fulfilled: true,
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
          data: { items: action.payload.data.items || [] },
        };
        break;
      case REJECTED_ACTION(LIST_GCP_KEY_RINGS):
        draft.gcpKeyRings = {
          ...initialState.gcpKeyRings,
          ...getErrorState(action),
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
        };
        break;

      case PENDING_ACTION(LIST_GCP_KEYS):
        draft.gcpKeys.pending = true;
        break;
      case FULFILLED_ACTION(LIST_GCP_KEYS):
        draft.gcpKeys = {
          ...baseRequestState,
          fulfilled: true,
          cloudProvider: action.meta?.cloudProvider,
          credentials: action.meta?.credentials,
          keyLocation: action.meta?.keyLocation,
          keyRing: action.meta?.keyRing,
          data: { items: action.payload.data.items || [] },
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
        };
        break;

      case PENDING_ACTION(LIST_VPCS):
        draft.vpcs.pending = true;
        break;
      case FULFILLED_ACTION(LIST_VPCS): {
        const items = action.payload.data.items || [];
        const data =
          action.meta?.cloudProvider === 'aws'
            ? processAWSVPCs({ items })
            : { items, bySubnetID: {} };
        draft.vpcs = {
          ...baseRequestState,
          fulfilled: true,
          credentials: action.meta?.credentials,
          cloudProvider: action.meta?.cloudProvider,
          region: action.meta?.region,
          subnet: action.meta?.subnet,
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
        };
        break;
      case CLEAR_LIST_VPCS:
        return {
          ...state,
          vpcs: initialState.vpcs,
        };

      case CLEAR_ALL_CLOUD_PROVIDER_INQUIRIES:
        return { ...initialState };
    }
  });
}

ccsInquiriesReducer.initialState = initialState;

export default ccsInquiriesReducer;
