import React from 'react';

import { ClusterResource } from '~/types/accounts_mgmt.v1';
import { Unit, parseValueWithUnit } from '../../../../common/units';
import ClusterUtilizationChart from './ClusterUtilizationChart';

type ResourceUsageProps = {
  cpu: ClusterResource;
  memory: ClusterResource;
  metricsStatusMessage?: string;
  metricsAvailable: boolean;
  type: string;
};

const ResourceUsage = ({
  cpu,
  memory,
  metricsStatusMessage,
  metricsAvailable,
  type,
}: ResourceUsageProps) => {
  // Why parse memory but not cpu?
  // In theory both are `ValueWithUnit` but openapi only documents units for the case of bytes,
  // and we only implemented parseValueWithUnit() for "B", "KB", "KiB" etc.
  // In practice server doesn't humanize at all, always sends "B"!
  // TODO: make up our minds...
  const getValue = ({ value, unit }: { value: number; unit: string }) =>
    parseValueWithUnit(value, unit as Unit);

  return metricsAvailable ? (
    <>
      <ClusterUtilizationChart
        title="vCPU"
        total={cpu.total.value}
        used={cpu.used.value}
        unit="Cores"
        humanize={false}
        donutId="cpu_donut"
        type={type}
      />
      <ClusterUtilizationChart
        title="Memory"
        total={getValue(memory.total)}
        used={getValue(memory.used)}
        unit="B"
        humanize
        donutId="memory_donut"
        type={type}
      />
    </>
  ) : (
    <p>{metricsStatusMessage}</p>
  );
};

export default ResourceUsage;
