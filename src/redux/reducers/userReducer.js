import produce from 'immer';
import { userConstants } from '../constants';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';
import { userActions } from '../actions/userActions';

const initialState = {
  keycloakProfile: {},
  organization: {
    details: null,
    quotaList: userActions.emptyQuota(),
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
          details: action.payload.organization.data,
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
