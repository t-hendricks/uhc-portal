import { splitVersion } from '~/common/versionHelpers';

export const MAX_NODES = 180;
export const MAX_NODES_HCP = 250;
export const MAX_NODES_HCP_INSUFFICIEN_VERSION = 90;
export const MAX_NODES_HCP_500 = 500;

export const SPOT_MIN_PRICE = 0.01;

export const PIDS_LIMIT_MIN = 4096;
export const PIDS_LIMIT_MAX = 16_384;
export const PIDS_LIMIT_MAX_OVERRIDE = 3_694_303;

export const workerNodeVolumeSizeMinGiB = 128;
export const defaultWorkerNodeVolumeSizeGiB = 300;

/**
 * Returns ROSA/AWS OSD max worker node volume size, varies per cluster version.
 * In GiB.
 */
export const getWorkerNodeVolumeSizeMaxGiB = (clusterVersionRawId: string): number => {
  const [major, minor] = splitVersion(clusterVersionRawId);
  return (major > 4 || (major === 4 && minor >= 14) ? 16 : 1) * 1024;
};
