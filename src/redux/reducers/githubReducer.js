import produce from 'immer';
import {
  REJECTED_ACTION, PENDING_ACTION, FULFILLED_ACTION, baseRequestState,
} from '../reduxHelpers';
import { getErrorState } from '../../common/errors';
import { githubReleasesToFetch } from '../../common/installLinks';
import { GITHUB_GET_LATEST_RELEASE } from '../actions/githubActions';

// {'user/repo': {pending, fulfilled etc., data: release}}
const initialState = {};
githubReleasesToFetch.forEach((repo) => {
  initialState[repo] = baseRequestState;
});

function githubReducer(state = initialState, action) {
  return produce(state, (draft) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case REJECTED_ACTION(GITHUB_GET_LATEST_RELEASE):
        draft[action.meta.repo] = {
          ...initialState[action.meta.repo],
          ...getErrorState(action),
        };
        break;
      case PENDING_ACTION(GITHUB_GET_LATEST_RELEASE):
        draft[action.meta.repo].pending = true;
        break;
      case FULFILLED_ACTION(GITHUB_GET_LATEST_RELEASE):
        draft[action.meta.repo] = {
          ...initialState[action.meta.repo],
          fulfilled: true,
          data: action.payload.data,
        };
        break;
    }
  });
}

export default githubReducer;
