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

    const expected = [
      {
        group: 'dedicated-admins',
        href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users/u1',
        id: 'u1',
        kind: 'User',
      },
      {
        group: 'dedicated-admins',
        href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/dedicated-admins/users/u2',
        id: 'u2',
        kind: 'User',
      },
      {
        group: 'cluster-admins',
        href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users/u2',
        id: 'u2',
        kind: 'User',
      },
      {
        group: 'cluster-admins',
        href: '/api/clusters_mgmt/v1/clusters/1cnov3ee6p0d3n1tuu5e0a96n8rh4q5o/groups/cluster-admins/users/u3',
        id: 'u3',
        kind: 'User',
      },
    ];

    expect(result).toHaveProperty('groupUsers.users', expected);
  });
});
