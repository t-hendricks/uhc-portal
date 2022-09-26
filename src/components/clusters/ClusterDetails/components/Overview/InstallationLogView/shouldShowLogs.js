import clusterStates from '../../../../common/clusterStates';

const shouldShowLogs = (cluster) =>
  cluster.managed &&
  cluster.canEdit &&
  (cluster.state === clusterStates.WAITING ||
    cluster.state === clusterStates.PENDING ||
    cluster.state === clusterStates.INSTALLING ||
    cluster.state === clusterStates.ERROR ||
    cluster.state === clusterStates.UNINSTALLING);

export default shouldShowLogs;
