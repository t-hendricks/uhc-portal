import { Cluster } from '~/types/clusters_mgmt.v1';
import { isClusterUpgrading } from './clusterStates';

const getClusterVersion = (cluster: Cluster): string =>
  (isClusterUpgrading(cluster) ? cluster.version?.raw_id : cluster.openshift_version) ||
  cluster.version?.raw_id ||
  'N/A';

export default getClusterVersion;
