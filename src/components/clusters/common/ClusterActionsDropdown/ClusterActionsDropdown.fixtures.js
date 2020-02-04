import clusterStates from '../clusterStates';

const cluster = {
  id: 1,
  name: 'test-cluster',
  state: clusterStates.READY,
  console: { url: 'www.testuhc.com' },
  managed: true,
  canEdit: true,
  canDelete: true,
};

const props = {
  showConsoleButton: true,
  openModal: jest.fn(),
};

const managedReadyProps = {
  cluster: { ...cluster },
  ...props,
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
  },
  ...props,
};

const clusterNotReadyProps = {
  cluster: {
    state: clusterStates.ERROR,
    managed: true,
    canEdit: true,
    canDelete: true,
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
};
