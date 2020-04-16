import reducer, { initialState } from '../UsersReducer';
import UsersConstants from '../UsersConstants';
import { FULFILLED_ACTION } from '../../../../../../../redux/reduxHelpers';
import { mockGetUsersPayload } from './Users.fixtures';

describe('ClusterDetails UsersReducer', () => {
  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  it('should handle get users action', () => {
    const action = {
      type: FULFILLED_ACTION(UsersConstants.GET_USERS),
      payload: mockGetUsersPayload,
    };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('groupUsers.users', mockGetUsersPayload.users);
  });
});
