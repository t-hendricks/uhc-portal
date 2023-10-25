import { ClusterFromSubscription } from '~/types/types';
import { isClusterUpgrading } from './clusterStates';

const getClusterVersion = <E extends ClusterFromSubscription>(cluster: E): string =>
  (isClusterUpgrading(cluster) ? cluster.version?.raw_id : cluster.openshift_version) ||
  cluster.version?.raw_id ||
  'N/A';

export default getClusterVersion;
