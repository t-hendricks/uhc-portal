import produce from 'immer';
import { userConstants } from '../constants';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';
import { billingModels, knownProducts } from '../../common/subscriptionTypes';

/**
 * Constructs a blank quota data structure (extracted for tests).
 */
export const emptyQuota = () => {
  const clustersQuotaByAz = () => ({
    singleAz: { available: 0 },
    multiAz: { available: 0 },
    totalAvailable: 0,
  });
  const clustersQuotaByInfraAz = () => ({
    byoc: clustersQuotaByAz(),
    rhInfra: clustersQuotaByAz(),
    isAvailable: false,
  });
  const clustersQuotaByProviderInfraAz = () => ({
    aws: clustersQuotaByInfraAz(),
    gcp: clustersQuotaByInfraAz(),
  });
  const clustersQuotaByProductProviderInfraAz = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = clustersQuotaByProviderInfraAz();
    });
    return result;
  };
  const clustersQuotaByBillingProductProviderInfraAz = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = clustersQuotaByProductProviderInfraAz();
    });
    return result;
  };

  const nodesQuotaByInfra = () => ({
    byoc: { available: 0 },
    rhInfra: { available: 0 },
  });
  const nodesQuotaByProviderInfra = () => ({
    aws: nodesQuotaByInfra(),
    gcp: nodesQuotaByInfra(),
  });
  const nodesQuotaByProductProviderInfra = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = nodesQuotaByProviderInfra();
    });
    return result;
  };
  const nodesQuotaByBillingProductProviderInfra = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = nodesQuotaByProductProviderInfra();
    });
    return result;
  };

  const storageQuotaByAZ = () => ({
    singleAZ: { available: 0 },
    multiAZ: { available: 0 },
  });

  const storageQuotaByInfraAZ = () => ({
    byoc: storageQuotaByAZ(),
    rhInfra: storageQuotaByAZ(),
    isAvailable: false,
  });

  const storageQuotaByProviderInfraAZ = () => ({
    aws: storageQuotaByInfraAZ(),
    gcp: storageQuotaByInfraAZ(),
  });

  const storageQuotaByProductProviderInfraAZ = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = storageQuotaByProviderInfraAZ();
    });
    return result;
  };

  // Initialize an empty tree for storage quota.
  // To be populated at processStorageQuota.
  // the tree levels are:
  // billing model -> products -> cloud-provider -> infra (byoc, rhinfra) -> multi / single az.
  const storageQuotaByBillingProductProviderInfraAZ = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = storageQuotaByProductProviderInfraAZ();
    });
    return result;
  };

  const loadBalancerQuotaByAZ = () => ({
    singleAZ: { available: 0 },
    multiAZ: { available: 0 },
  });

  const loadBalancerQuotaByInfraAZ = () => ({
    byoc: loadBalancerQuotaByAZ(),
    rhInfra: loadBalancerQuotaByAZ(),
    isAvailable: false,
  });

  const loadBalancerQuotaByProviderInfraAZ = () => ({
    aws: loadBalancerQuotaByInfraAZ(),
    gcp: loadBalancerQuotaByInfraAZ(),
  });

  const loadBalancerQuotaByProductProviderInfraAZ = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = loadBalancerQuotaByProviderInfraAZ();
    });
    return result;
  };

  // Initialize an empty tree for load balancer quota.
  // To be populated at processLoadBalancerQuota.
  // the tree levels are:
  // billing model -> products -> cloud-provider -> infra (byoc, rhinfra) -> multi / single az.
  const loadBalancerBillingProductProviderInfraAZ = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = loadBalancerQuotaByProductProviderInfraAZ();
    });
    return result;
  };

  const addOnsQuotaByAz = () => ({
    singleAz: { available: 0 },
    multiAz: { available: 0 },
    totalAvailable: 0,
  });
  const addOnsQuotaByInfraAz = () => ({
    byoc: addOnsQuotaByAz(),
    rhInfra: addOnsQuotaByAz(),
    isAvailable: false,
  });
  const addOnsQuotaByProviderInfraAz = () => ({
    aws: addOnsQuotaByInfraAz(),
    gcp: addOnsQuotaByInfraAz(),
  });
  const addOnsQuotaByProductProviderInfraAz = () => {
    const result = {};
    Object.keys(knownProducts).forEach((p) => {
      result[p] = addOnsQuotaByProviderInfraAz();
    });
    return result;
  };
  const addOnsQuotaByBillingProductProviderInfraAz = () => {
    const result = {};
    Object.values(billingModels).forEach((model) => {
      result[model] = addOnsQuotaByProductProviderInfraAz();
    });
    return result;
  };

  return {
    items: [],
    clustersQuota: clustersQuotaByBillingProductProviderInfraAz(),
    nodesQuota: nodesQuotaByBillingProductProviderInfra(),
    storageQuota: storageQuotaByBillingProductProviderInfraAZ(),
    loadBalancerQuota: loadBalancerBillingProductProviderInfraAZ(),
    addOnsQuota: addOnsQuotaByBillingProductProviderInfraAz(),
  };
};

const initialState = {
  keycloakProfile: {},
  organization: {
    details: null,
    quotaList: emptyQuota(),
    ...baseRequestState,
  },
  selfTermsReviewResult: {
    terms_available: false,
    terms_required: false,
    redirect_url: '',
    ...baseRequestState,
  },
};

function userProfile(state = initialState, action) {
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case userConstants.USER_INFO_RESPONSE:
        draft.keycloakProfile = action.payload;
        break;

      // GET_ORGANIZATION
      case REJECTED_ACTION(userConstants.GET_ORGANIZATION):
        draft.organization = {
          ...initialState.organization,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(userConstants.GET_ORGANIZATION):
        draft.organization.pending = true;
        break;
      case FULFILLED_ACTION(userConstants.GET_ORGANIZATION):
        draft.organization = {
          ...initialState.organization,
          fulfilled: true,
          details: action.payload.organization,
          quotaList: action.payload.quota,
          timestamp: new Date(),
        };
        break;
      // SELF_TERMS_REVIEW
      case REJECTED_ACTION(userConstants.SELF_TERMS_REVIEW):
        draft.selfTermsReviewResult = {
          ...initialState.selfTermsReviewResult,
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(userConstants.SELF_TERMS_REVIEW):
        draft.selfTermsReviewResult.pending = true;
        break;
      case FULFILLED_ACTION(userConstants.SELF_TERMS_REVIEW):
        draft.selfTermsReviewResult = {
          ...initialState.selfTermsReviewResult,
          fulfilled: true,
          ...action.payload.data,
        };
        break;
    }
  });
}

export default userProfile;
