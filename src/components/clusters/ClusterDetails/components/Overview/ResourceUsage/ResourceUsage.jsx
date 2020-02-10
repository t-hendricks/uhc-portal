import get from 'lodash/get';
import React from 'react';
import PropTypes from 'prop-types';

import ClusterUtilizationChart from './ClusterUtilizationChart';
import { metricsStatusMessages } from './ResourceUsage.consts';
import { subscriptionStatuses } from '../../../../../../common/subscriptionTypes';
import { parseValueWithUnit } from '../../../../../../common/units';
import { hasResourceUsageMetrics } from '../../Monitoring/monitoringHelper';

function ResourceUsage({ cluster }) {
  const isArchived = get(cluster, 'subscription.status', false) === subscriptionStatuses.ARCHIVED;
  const metricsAvailable = hasResourceUsageMetrics(cluster);

  // Why parse memory but not cpu?
  // In theory both are `ValueWithUnit` but openapi only documents units for the case of bytes,
  // and we only implemented parseValueWithUnit() for "B", "KB", "KiB" etc.
  // In practice server doesn't humanize at all, always sends "B"!
  // TODO: make up our minds...
  const getValue = ({ value, unit }) => parseValueWithUnit(value, unit);

  return (
    <>
      { metricsAvailable ? (
        <>
          <ClusterUtilizationChart
            title="vCPU"
            total={cluster.metrics.cpu.total.value}
            used={cluster.metrics.cpu.used.value}
            unit="Cores"
            humanize={false}
            donutId="cpu_donut"
          />
          <ClusterUtilizationChart
            title="Memory"
            total={getValue(cluster.metrics.memory.total)}
            used={getValue(cluster.metrics.memory.used)}
            unit="B"
            humanize
            donutId="memory_donut"
          />
        </>
      )
        : (
          <p>
            { isArchived ? metricsStatusMessages.archived
              : metricsStatusMessages[cluster.state.state] || metricsStatusMessages.default}
          </p>
        ) }
    </>
  );
}

ResourceUsage.propTypes = {
  cluster: PropTypes.object,
};

export default ResourceUsage;
