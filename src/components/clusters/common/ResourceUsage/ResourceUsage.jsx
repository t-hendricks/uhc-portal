import React from 'react';
import PropTypes from 'prop-types';

import ClusterUtilizationChart from './ClusterUtilizationChart';
import { parseValueWithUnit } from '../../../../common/units';

function ResourceUsage({ cpu, memory, metricsStatusMessage, metricsAvailable, type }) {
  // Why parse memory but not cpu?
  // In theory both are `ValueWithUnit` but openapi only documents units for the case of bytes,
  // and we only implemented parseValueWithUnit() for "B", "KB", "KiB" etc.
  // In practice server doesn't humanize at all, always sends "B"!
  // TODO: make up our minds...
  const getValue = ({ value, unit }) => parseValueWithUnit(value, unit);

  return (
    <>
      {metricsAvailable ? (
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
      )}
    </>
  );
}

ResourceUsage.propTypes = {
  cpu: PropTypes.object.isRequired,
  memory: PropTypes.object.isRequired,
  metricsStatusMessage: PropTypes.string,
  metricsAvailable: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
};

export default ResourceUsage;
