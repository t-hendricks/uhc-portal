import reducer, { initialState } from '../UsersReducer';
import UsersConstants from '../UsersConstants';
import { FULFILLED_ACTION } from '../../../../../../../redux/reduxHelpers';
import { mockGetClusterAdminsPayload, mockGetDedicatedAdminsPayload } from './Users.fixtures';

describe('ClusterDetails UsersReducer', () => {
  describe('should not handle unrelated actions', () => {
    it('leaves the state unmodified', () => {
      const action = { type: 'HOLY_GUACAMOLE' };
      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  it('should handle get cluster admins action', () => {
    const action = {
      type: FULFILLED_ACTION(UsersConstants.GET_CLUSTER_ADMINS),
      payload: mockGetClusterAdminsPayload,
    };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('groupUsers.clusterAdmins.users', mockGetClusterAdminsPayload.data.items);
  });

  it('should handle get dedicated admins action', () => {
    const action = {
      type: FULFILLED_ACTION(UsersConstants.GET_DEDICATED_ADMNIS),
      payload: mockGetDedicatedAdminsPayload,
    };
    const result = reducer(initialState, action);

    expect(result).toHaveProperty('groupUsers.dedicatedAdmins.users', mockGetDedicatedAdminsPayload.data.items);
  });
});
