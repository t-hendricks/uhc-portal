import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';

import ClusterUtilizationChart from './ClusterUtilizationChart';
import { metricsStatusMessages, maxMetricsTimeDelta } from './ResourceUsage.consts';
import { parseValueWithUnit } from '../../../../../../common/units';
import { getMetricsTimeDelta } from '../../../../../../common/helpers';

function ResourceUsage({ cluster }) {
  const metricsLatsUpdate = new Date(cluster.metrics.cpu.updated_timestamp);

  const metricsAvailable = process.env.UHC_SHOW_OLD_METRICS === 'true'
    ? true
    : getMetricsTimeDelta(metricsLatsUpdate) < maxMetricsTimeDelta;

  // Why parse memory but not cpu?
  // In theory both are `ValueWithUnit` but openapi only documents units for the case of bytes,
  // and we only implemented parseValueWithUnit() for "B", "KB", "KiB" etc.
  // In practice server doesn't humanize at all, always sends "B"!
  // TODO: make up our minds...
  const getValue = ({ value, unit }) => parseValueWithUnit(value, unit);

  return (
    <Grid fluid>
      <div id="cl-details-charts" className="cl-details-card">
        <div className="cl-details-card-title"><h3>Resource Usage</h3></div>
        <div className="cl-details-card-body">
          { metricsAvailable ? (
            <React.Fragment>
              <ClusterUtilizationChart
                title="vCPU"
                total={cluster.metrics.cpu.total.value}
                used={cluster.metrics.cpu.used.value}
                unit="Cores"
                humanize={false}
                donutId="cpu_donut"
              />
              <ClusterUtilizationChart
                title="MEMORY"
                total={getValue(cluster.metrics.memory.total)}
                used={getValue(cluster.metrics.memory.used)}
                unit="B"
                humanize
                donutId="memory_donut"
              />
            </React.Fragment>)
            : (
              <p>
                {metricsStatusMessages[cluster.state] || metricsStatusMessages.default}
              </p>
            ) }
        </div>
      </div>
    </Grid>
  );
}

ResourceUsage.propTypes = {
  cluster: PropTypes.object,
};

export default ResourceUsage;
