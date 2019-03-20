import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'patternfly-react';

import ClusterUtilizationChart from './ClusterUtilizationChart';
import { metricsStatusMessages, maxMetricsTimeDelta } from './ResourceUsage.consts';
import { parseValueWithUnit } from '../../../../../common/unitParser';
import { getMetricsTimeDelta } from '../../../../../common/helpers';

function ResourceUsage({ cluster }) {
  const metricsLatsUpdate = new Date(cluster.cpu.updated_timestamp);

  const metricsAvailable = getMetricsTimeDelta(metricsLatsUpdate) < maxMetricsTimeDelta;

  return (
    <Grid fluid>
      <div id="cl-details-charts" className="cl-details-card">
        <div className="cl-details-card-title"><h3>Resource Usage</h3></div>
        <div className="cl-details-card-body">
          { metricsAvailable ? (
            <React.Fragment>
              <ClusterUtilizationChart
                title="CPU"
                total={cluster.cpu.total.value}
                unit="Cores"
                used={cluster.cpu.used.value}
                donutId="cpu_donut"
              />
              <ClusterUtilizationChart
                title="MEMORY"
                totalBytes={
                  parseValueWithUnit(cluster.memory.total.value, cluster.memory.total.unit)
                }
                usedBytes={
                  parseValueWithUnit(cluster.memory.used.value, cluster.memory.used.unit)
                }
                donutId="memory_donut"
              />
              <ClusterUtilizationChart
                title="STORAGE"
                totalBytes={
                  parseValueWithUnit(cluster.storage.total.value, cluster.storage.total.unit)
                }
                usedBytes={
                  parseValueWithUnit(cluster.storage.used.value, cluster.storage.used.unit)
                }
                donutId="storage_donut"
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
