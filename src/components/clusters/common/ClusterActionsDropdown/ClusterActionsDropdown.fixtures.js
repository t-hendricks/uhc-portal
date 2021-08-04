import clusterStates from '../clusterStates';

const cluster = {
  id: 1,
  name: 'test-cluster',
  display_name: 'test-cluster',
  state: clusterStates.READY,
  console: { url: 'www.testuhc.com' },
  managed: true,
  ccs: {
    enabled: false,
  },
  canEdit: true,
  canDelete: true,
  status: {
    state: clusterStates.READY,
    dns_ready: true,
    configuration_mode: 'full',
  },
  subscription: {
    id: 'subscription-id',
  },
};

const osdTrialCluster = {
  product: {
    kind: 'ProductLink',
    // value after normalization
    id: 'OSDTrial',
    href: '/api/clusters_mgmt/v1/products/osdtrial?trial=osd',
  },
  ...cluster,
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

const managedReadyOsdTrialProps = {
  cluster: { ...osdTrialCluster },
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

const clusterHibernatingProps = {
  cluster: {
    ...cluster,
    state: clusterStates.HIBERNATING,
    status: {
      ...cluster.status,
      state: clusterStates.HIBERNATING,
    },
  },
  ...props,
};

const clusterUninstallingProps = {
  cluster: {
    ...cluster,
    state: clusterStates.UNINSTALLING,
    status: {
      ...cluster.status,
      state: clusterStates.UNINSTALLING,
    },
  },
  ...props,
};

const clusterNotReadyProps = {
  cluster: {
    ...cluster,
    console: undefined,
    state: clusterStates.ERROR,
    status: {
      state: clusterStates.ERROR,
      dns_ready: false,
      provision_error_message: 'some message',
      provision_error_code: 'some code',
    },
  },
  ...props,
};

const clusterReadOnlyProps = {
  cluster: {
    ...cluster,
    status: {
      ...cluster.status,
      configuration_mode: 'read_only',
    },
  },
  ...props,
};

const selfManagedProps = {
  cluster: {
    state: clusterStates.READY,
    managed: false,
    ccs: {
      enabled: false,
    },
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
  managedReadyOsdTrialProps,
  deleteModalData,
  clusterHibernatingProps,
  clusterUninstallingProps,
  clusterNotReadyProps,
  clusterReadOnlyProps,
  selfManagedProps,
  cluster,
  osdTrialCluster,
  organizationClusterProps,
  hibernateClusterModalData,
};
