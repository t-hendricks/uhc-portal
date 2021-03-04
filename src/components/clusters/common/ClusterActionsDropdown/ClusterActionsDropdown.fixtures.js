import clusterStates from '../clusterStates';

const cluster = {
  id: 1,
  name: 'test-cluster',
  display_name: 'test-cluster',
  state: clusterStates.READY,
  console: { url: 'www.testuhc.com' },
  managed: true,
  canEdit: true,
  canDelete: true,
  status: {
    state: clusterStates.READY,
    dns_ready: true,
  },
  subscription: {
    id: 'subscription-id',
  },
};

const props = {
  showConsoleButton: true,
  canSubscribeOCP: false,
  canHibernateCluster: true,
  canTransferClusterOwnership: false,
  openModal: jest.fn(),
  toggleSubscriptionReleased: jest.fn(),
  refreshFunc: jest.fn(),
};

const managedReadyProps = {
  cluster: { ...cluster },
  ...props,
};

const hibernateClusterModalData = {
  clusterID: cluster.id,
  clusterName: cluster.name,
  subscriptionID: cluster.subscription.id,
};

const deleteModalData = {
  clusterID: cluster.id,
  clusterName: cluster.name,
};

const clusterUninstallingProps = {
  cluster: {
    state: clusterStates.UNINSTALLING,
    managed: true,
    canEdit: true,
    canDelete: true,
    status: {
      state: clusterStates.READY,
      dns_ready: true,
    },
  },
  ...props,
};

const clusterNotReadyProps = {
  cluster: {
    state: clusterStates.ERROR,
    managed: true,
    canEdit: true,
    canDelete: true,
    status: {
      state: clusterStates.READY,
      dns_ready: true,
    },
  },
  ...props,
};

const selfManagedProps = {
  cluster: {
    state: clusterStates.READY,
    managed: false,
    canEdit: true,
    canDelete: true,
  },
  subscription: {
    items: [
      {
        id: 42,
        support_level: 'Standard',
        plan: {
          id: 'OCP',
        },
      },
    ],
  },
  organization: {
    ebs_account_id: '123456',
  },
  ...props,
};

const organizationClusterProps = {
  cluster: { ...cluster, canEdit: false, canDelete: false },
  ...props,
};

export {
  managedReadyProps,
  deleteModalData,
  clusterUninstallingProps,
  clusterNotReadyProps,
  selfManagedProps,
  cluster,
  organizationClusterProps,
  hibernateClusterModalData,
};
