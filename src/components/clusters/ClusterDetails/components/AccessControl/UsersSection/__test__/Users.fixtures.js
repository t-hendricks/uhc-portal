const mockGetUsersPayload = {
  users: [
    {
      kind: 'User',
      href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/dedicated-admins/users/user_name',
      id: 'user_name',
    },
  ],
  clusterID: 'fake id',
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
