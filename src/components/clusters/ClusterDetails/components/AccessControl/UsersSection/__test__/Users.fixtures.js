
const mockGetDedicatedAdminsPayload = {
  data: {
    kind: 'UserList',
    href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/dedicated-admins/users',
    page: 1,
    size: 1,
    total: 1,
    items: [
      {
        kind: 'User',
        href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/cluster-admins/users/user_name',
        id: 'user_name',
      },
    ],
  },
};


const mockGetClusterAdminsPayload = {
  data: {
    kind: 'UserList',
    href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/dedicated-admins/users',
    page: 1,
    size: 1,
    total: 1,
    items: [
      {
        kind: 'User',
        href: '/api/clusters_mgmt/v1/clusters/1KUIgsvp1cTRvBXsDadd1fwd69j/groups/cluster-admins/users/user_name',
        id: 'user_name',
      },
    ],
  },
};


const stateWithUsers = {
  dedicatedAdmins: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: true,
    clusterID: undefined,
    users: mockGetDedicatedAdminsPayload.data.items,
  },
  clusterAdmins: {
    error: false,
    errorMessage: '',
    pending: false,
    fulfilled: true,
    clusterID: undefined,
    users: mockGetClusterAdminsPayload.data.items,
  },
};

export { mockGetDedicatedAdminsPayload, mockGetClusterAdminsPayload, stateWithUsers };
