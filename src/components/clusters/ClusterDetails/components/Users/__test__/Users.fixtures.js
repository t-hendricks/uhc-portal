const mockGetUsersPayload = {
  users: {
    data: {
      kind: 'UserList',
      href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/dedicated-admins/users',
      page: 1,
      size: 1,
      total: 1,
      items: [
        {
          kind: 'User',
          href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/dedicated-admins/users/user_name',
          id: 'user_name',
        },
      ],
    },
  },
};

const stateWithUsers = {
  // later on this will need to change to support many arbitrary groups
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: true,
  clusterID: 'fake id',
  users: mockGetUsersPayload.users.data,
};

export { mockGetUsersPayload, stateWithUsers };
