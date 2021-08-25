import React from 'react';
import { ChartDonut, ChartLegend } from '@patternfly/react-charts';
import PropTypes from 'prop-types';

import {
  riskLabels, chartColorScale, InsightsLegendIconComponent, InsightsTitleComponent,
} from './InsightsAdvisorHelpers';

const Chart = ({ entries, issueCount }) => (
  <ChartDonut
    data={entries.map(([k, v]) => ({
      label: `${riskLabels[k]} ${v}`,
      x: k,
      y: v,
    }))}
    title={`${issueCount}`}
    subTitle={`Total ${issueCount === 1 ? 'issue' : 'issues'}`}
    legendData={entries.map(([k, v]) => ({ name: `${v} ${riskLabels[k]}` }))}
    legendOrientation="vertical"
    legendPosition="right"
    constrainToVisibleArea
    width={350}
    height={180}
    colorScale={chartColorScale}
    legendComponent={(
      <ChartLegend
        data={entries.map(([k, v]) => ({
          name: `${v} ${riskLabels[k]}`,
          id: k,
          value: v,
        }))}
        labelComponent={<InsightsTitleComponent />}
        dataComponent={<InsightsLegendIconComponent />}
        x={210}
      />
    )}
    padAngle={0}
    padding={{
      bottom: 0,
      left: 20,
      right: 150, // Adjusted to accommodate legend
      top: 20,
    }}

  />
);

export default Chart;

Chart.propTypes = {
  entries: PropTypes.array.isRequired,
  issueCount: PropTypes.number.isRequired,
};
