import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';

import ClusterUtilizationChart from './ClusterUtilizationChart';
import { metricsStatusMessages, maxMetricsTimeDelta } from './ResourceUsage.consts';
import { parseValueWithUnit } from '../../../../../../common/unitParser';
import { getMetricsTimeDelta } from '../../../../../../common/helpers';

function ResourceUsage({ cluster }) {
  const metricsLatsUpdate = new Date(cluster.metrics.cpu.updated_timestamp);

  const metricsAvailable = process.env.UHC_SHOW_OLD_METRICS === 'true'
    ? true
    : getMetricsTimeDelta(metricsLatsUpdate) < maxMetricsTimeDelta;

  return (
    <Grid fluid>
      <div id="cl-details-charts" className="cl-details-card">
        <div className="cl-details-card-title"><h3>Resource Usage</h3></div>
        <div className="cl-details-card-body">
          { metricsAvailable ? (
            <React.Fragment>
              <ClusterUtilizationChart
                title="CPU"
                total={cluster.metrics.cpu.total.value}
                unit="Cores"
                used={cluster.metrics.cpu.used.value}
                donutId="cpu_donut"
              />
              <ClusterUtilizationChart
                title="MEMORY"
                totalBytes={
                  parseValueWithUnit(cluster.metrics.memory.total.value,
                    cluster.metrics.memory.total.unit)
                }
                usedBytes={
                  parseValueWithUnit(cluster.metrics.memory.used.value,
                    cluster.metrics.memory.used.unit)
                }
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
