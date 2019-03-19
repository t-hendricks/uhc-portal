import clusterStates from '../clusterStates';

const cluster = {
  id: 1,
  name: 'test-cluster',
  state: clusterStates.READY,
  console: { url: 'www.testuhc.com' },
  managed: true,
};

const props = {
  showConsoleButton: true,
  openModal: jest.fn(),
  openEditClusterDialog: jest.fn(),
};

const managedReadyProps = {
  cluster: { ...cluster },
  ...props,
};

const deleteModalData = {
  clusterID: cluster.id,
  clusterName: cluster.name,
  managed: cluster.managed,
};

const clusterUninstallingProps = {
  cluster: { state: clusterStates.UNINSTALLING, managed: true },
  ...props,
};

const clusterNotReadyProps = {
  cluster: { state: clusterStates.ERROR, managed: true },
  ...props,
};

const selfManagedProps = {
  cluster: { state: clusterStates.READY, managed: false },
  ...props,
};

export {
  managedReadyProps,
  deleteModalData,
  clusterUninstallingProps,
  clusterNotReadyProps,
  selfManagedProps,
  cluster,
};
