import { MachinePool, NodePool } from '~/types/clusters_mgmt.v1';
import { EditMachinePoolValues } from './hooks/useMachinePoolFormik';

const getLabels = (labels: EditMachinePoolValues['labels']) =>
  labels.length === 1 && !labels[0].key
    ? {}
    : labels.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

const getTaints = (taints: EditMachinePoolValues['taints']) =>
  taints.length === 1 && !taints[0].key ? [] : taints;

export const getBaseMachineOrNodePool = (
  values: EditMachinePoolValues,
  isHypershift: boolean,
  isMultiAz: boolean,
) => {
  const pool: MachinePool | NodePool = {
    id: values.name,
    labels: getLabels(values.labels),
    taints: getTaints(values.taints),
  };
  if (values.autoscaling) {
    const maxReplica = isMultiAz ? values.autoscaleMax * 3 : values.autoscaleMax;
    const minReplica = isMultiAz ? values.autoscaleMin * 3 : values.autoscaleMin;
    if (isHypershift) {
      pool.autoscaling = {
        max_replica: maxReplica,
        min_replica: minReplica,
      };
    } else {
      pool.autoscaling = {
        max_replicas: maxReplica,
        min_replicas: minReplica,
      };
    }
  } else {
    pool.replicas = values.replicas;
  }

  return pool;
};
