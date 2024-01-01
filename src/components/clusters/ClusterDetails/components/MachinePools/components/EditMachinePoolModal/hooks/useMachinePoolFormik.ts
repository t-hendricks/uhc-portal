import * as React from 'react';
import * as Yup from 'yup';
import { Cluster, MachinePool, NodePool, Subnetwork } from '~/types/clusters_mgmt.v1';
import { isMultiAZ } from '~/components/clusters/ClusterDetails/clusterDetailsHelper';
import {
  checkLabelKey,
  checkLabelValue,
  checkMachinePoolName,
  checkNodePoolName,
  checkTaintKey,
  checkTaintValue,
  validateSecurityGroups,
} from '~/common/validators';
import { GlobalState } from '~/redux/store';
import { isHypershiftCluster, isROSA } from '~/components/clusters/common/clusterStates';
import {
  defaultWorkerNodeVolumeSizeGiB,
  getWorkerNodeVolumeSizeMaxGiB,
  workerNodeVolumeSizeMinGiB,
} from '~/components/clusters/wizards/rosa/constants';
import { SPOT_MIN_PRICE } from '~/components/clusters/common/machinePools/constants';
import { getNodeOptions } from '~/components/clusters/common/machinePools/utils';
import { PromiseReducerState } from '~/redux/types';
import { TaintEffect } from '../fields/TaintEffectField';
import { getClusterMinNodes } from '../../../machinePoolsHelper';
import useOrganization from './useOrganization';

export type EditMachinePoolValues = {
  name: string;
  autoscaling: boolean;
  autoscaleMin: number;
  autoscaleMax: number;
  replicas: number;
  labels: { key: string; value: string }[];
  taints: { key: string; value: string; effect: TaintEffect }[];
  useSpotInstances: boolean;
  spotInstanceType: 'onDemand' | 'maximum';
  maxPrice: number;
  diskSize: number;
  instanceType: string | undefined;
  subnet: Subnetwork | undefined;
  securityGroupIds: string[];
};

type UseMachinePoolFormikArgs = {
  machinePool: MachinePool | undefined;
  cluster: Cluster;
  machineTypes: GlobalState['machineTypes'];
  machinePools: PromiseReducerState<{
    data: MachinePool[];
  }>;
};

const isMachinePool = (pool?: MachinePool | NodePool): pool is MachinePool =>
  pool?.kind === 'MachinePool';

const noDecimalTest = (value: number) => value === Math.floor(value);
const requiredSubnet = (subnet: Subnetwork | undefined) =>
  subnet === undefined || !!subnet.subnet_id;

const useMachinePoolFormik = ({
  machinePool,
  cluster,
  machineTypes,
  machinePools,
}: UseMachinePoolFormikArgs) => {
  const isMultiAz = isMultiAZ(cluster);
  const rosa = isROSA(cluster);

  const minNodesRequired = getClusterMinNodes({
    cluster,
    machineTypesResponse: machineTypes,
    machinePool,
    machinePools: machinePools.data || [],
  });

  const initialValues = React.useMemo<EditMachinePoolValues>(() => {
    let autoscaleMin;
    let autoscaleMax;
    let useSpotInstances;
    let spotInstanceType: EditMachinePoolValues['spotInstanceType'] = 'onDemand';
    let maxPrice;
    let diskSize;

    autoscaleMin = machinePool?.autoscaling?.min_replicas || minNodesRequired;
    autoscaleMax = machinePool?.autoscaling?.max_replicas || minNodesRequired;
    const instanceType = machinePool?.instance_type;

    if (isMachinePool(machinePool)) {
      useSpotInstances = !!machinePool.aws?.spot_market_options;
      spotInstanceType = machinePool.aws?.spot_market_options?.max_price ? 'maximum' : 'onDemand';

      maxPrice = machinePool.aws?.spot_market_options?.max_price;
      diskSize = machinePool.root_volume?.aws?.size || machinePool.root_volume?.gcp?.size;
    }

    if (isMultiAz) {
      autoscaleMin /= 3;
      autoscaleMax /= 3;
    }

    return {
      name: machinePool?.id || '',
      autoscaling: !!machinePool?.autoscaling,
      autoscaleMin,
      autoscaleMax: autoscaleMax || 1,
      replicas: machinePool?.replicas || minNodesRequired,
      labels: machinePool?.labels
        ? Object.keys(machinePool.labels).map((key) => ({
            key,
            value: machinePool.labels?.[key]!!,
          }))
        : [{ key: '', value: '' }],
      taints: machinePool?.taints?.map((taint) => ({
        key: taint.key || '',
        value: taint.value || '',
        effect: (taint.effect as TaintEffect) || 'NoSchedule',
      })) || [{ key: '', value: '', effect: 'NoSchedule' }],
      useSpotInstances: !!useSpotInstances,
      spotInstanceType,
      maxPrice: maxPrice || SPOT_MIN_PRICE,
      diskSize: diskSize || defaultWorkerNodeVolumeSizeGiB,
      instanceType,
      subnet: undefined,
      securityGroupIds: machinePool?.aws?.additional_security_group_ids || [],
    };
  }, [machinePool, isMultiAz, minNodesRequired]);

  const isHypershift = isHypershiftCluster(cluster);

  const maxDiskSize = getWorkerNodeVolumeSizeMaxGiB(cluster.version?.raw_id || '');

  const hasMachinePool = !!machinePool;

  const organization = useOrganization();

  const validationSchema = React.useMemo(
    () =>
      Yup.lazy<EditMachinePoolValues>((values) => {
        const minNodes = isMultiAz ? minNodesRequired / 3 : minNodesRequired;
        const secGroupValidation = validateSecurityGroups(values.securityGroupIds);
        const nodeOptions = getNodeOptions({
          cluster,
          machinePools: machinePools.data || [],
          machineTypes,
          quota: organization.quotaList,
          minNodes: minNodesRequired,
          machineTypeId: values.instanceType,
          editMachinePoolId: values.name,
        });
        const maxNodes = nodeOptions.length ? nodeOptions[nodeOptions.length - 1] : 0;

        return Yup.object({
          name: Yup.string().test('mp-name', '', (value) => {
            const err = isHypershift ? checkNodePoolName(value) : checkMachinePoolName(value);
            if (err) {
              return new Yup.ValidationError(err, value, 'name');
            }

            if (!hasMachinePool && machinePools.data?.some((mp) => mp.id === value)) {
              return new Yup.ValidationError('Name has to be unique.', value, 'name');
            }
            return false;
          }),
          labels: Yup.array().of(
            Yup.object<{ key: string; value: string }>().shape({
              key: Yup.string().test('label-key', '', function test(value) {
                if (values.labels.length === 1 && (!value || value.length === 0)) {
                  return false;
                }
                const err = checkLabelKey(value);
                if (err) {
                  return new Yup.ValidationError(err, value, this.path);
                }

                if (values.labels.filter(({ key }) => key === value).length > 1) {
                  return new Yup.ValidationError(
                    'Each label must have a different key.',
                    value,
                    this.path,
                  );
                }
                return false;
              }),
              value: Yup.string().test('label-value', '', function test(value) {
                const err = checkLabelValue(value);
                if (err) {
                  return new Yup.ValidationError(err, value, this.path);
                }

                const labelKey = this.parent.key;
                if (value && !labelKey) {
                  return new Yup.ValidationError('Label key has to be defined', value, this.path);
                }
                return false;
              }),
            }),
          ),
          taints: Yup.array().of(
            Yup.object().shape({
              key: Yup.string().test('taint-key', '', function test(value) {
                if (values.taints.length === 1 && (!value || value.length === 0)) {
                  return false;
                }
                const err = checkTaintKey(value);
                return err ? new Yup.ValidationError(err, value, this.path) : false;
              }),
              value: Yup.string().test('taint-value', '', function test(value) {
                const err = checkTaintValue(value);
                if (err) {
                  return new Yup.ValidationError(err, value, this.path);
                }

                const taintKey = this.parent.key;
                if (value && !taintKey) {
                  return new Yup.ValidationError('Taint key has to be defined', value, this.path);
                }
                return false;
              }),
            }) as any,
          ),
          autoscaleMin: values.autoscaling
            ? Yup.number()
                .test(
                  'whole-number',
                  'Decimals are not allowed. Enter a whole number.',
                  noDecimalTest,
                )
                .min(minNodes, `Input cannot be less than ${minNodes}.`)
                .max(values.autoscaleMax, 'Min nodes cannot be more than max nodes.')
            : Yup.number(),
          autoscaleMax: values.autoscaling
            ? Yup.number()
                .test('autoscale-max', '', (value) => {
                  if (!noDecimalTest(value)) {
                    return new Yup.ValidationError(
                      'Decimals are not allowed. Enter a whole number.',
                      value,
                      'autoscaleMax',
                    );
                  }
                  if (value < 1) {
                    return new Yup.ValidationError(
                      'Max nodes must be greater than 0.',
                      value,
                      'autoscaleMax',
                    );
                  }
                  return false;
                })
                .min(values.autoscaleMin, 'Max nodes cannot be less than min nodes.')
                .max(
                  isMultiAz ? maxNodes / 3 : maxNodes,
                  `Input cannot be more than ${isMultiAz ? maxNodes / 3 : maxNodes}.`,
                )
            : Yup.number(),
          autoscaling: Yup.boolean(),
          diskSize: rosa
            ? Yup.number()
                .min(
                  workerNodeVolumeSizeMinGiB,
                  `Disk size must be at least ${workerNodeVolumeSizeMinGiB} GiB`,
                )
                .max(maxDiskSize, `Disk size can not be more than ${maxDiskSize} GiB`)
                .test(
                  'whole-number',
                  'Decimals are not allowed. Enter a whole number.',
                  noDecimalTest,
                )
            : Yup.number(),
          spotInstanceType: Yup.mixed(),
          maxPrice:
            values.spotInstanceType === 'maximum'
              ? Yup.number().min(SPOT_MIN_PRICE, `Price has to be at least ${SPOT_MIN_PRICE}`)
              : Yup.number(),
          instanceType: !hasMachinePool
            ? Yup.string().required('Compute node instance type is a required field.')
            : Yup.string(),
          replicas: Yup.number(),
          useSpotInstances: Yup.boolean(),
          subnet:
            !hasMachinePool && isHypershift
              ? Yup.object().test('subnet-is-required', 'Please select a subnet', requiredSubnet)
              : Yup.mixed(),
          securityGroupIds: isHypershift
            ? Yup.mixed()
            : Yup.array()
                .of(Yup.string())
                .test(
                  'max-security-groups',
                  secGroupValidation || '',
                  () => secGroupValidation === undefined,
                ),
        });
      }),
    [
      isHypershift,
      minNodesRequired,
      isMultiAz,
      rosa,
      maxDiskSize,
      hasMachinePool,
      machinePools.data,
      organization,
      cluster,
      machineTypes,
    ],
  );

  return { initialValues, validationSchema };
};

export default useMachinePoolFormik;
