import produce from 'immer';
import { TermsReviewResponse } from '~/types/authorizations.v1';
import { userConstants } from '../constants';
import {
  REJECTED_ACTION,
  PENDING_ACTION,
  FULFILLED_ACTION,
  baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';
import { UserAction } from '../actions/userActions';
import { PromiseActionType, PromiseReducerState } from '../types';
import { Organization, QuotaCost } from '../../types/accounts_mgmt.v1';
import { UserInfo } from '../../types/types';

export type OrganizationState = {
  details: Organization;
  quotaList: {
    items?: QuotaCost[];
  };
  timestamp: number;
};

export type State = {
  keycloakProfile: Partial<UserInfo>;
  organization: PromiseReducerState<OrganizationState>;
  selfTermsReviewResult: PromiseReducerState<TermsReviewResponse>;
};

const initialState: State = {
  keycloakProfile: {},
  organization: {
    ...baseRequestState,
    quotaList: {
      items: [],
    },
    timestamp: 0,
  },
  selfTermsReviewResult: {
    ...baseRequestState,
    terms_available: false,
    terms_required: false,
    redirect_url: '',
  },
};

const userProfile = (state = initialState, action: PromiseActionType<UserAction>): State =>
  produce(state, (draft) => {
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
          ...baseRequestState,
          fulfilled: true,
          details: action.payload.organization,
          quotaList: action.payload.quota,
          timestamp: new Date().getTime(),
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
          ...baseRequestState,
          fulfilled: true,
          ...action.payload.data,
          redirect_url: action.payload.data.redirect_url ?? '',
        };
        break;
    }
  });

export default userProfile;
