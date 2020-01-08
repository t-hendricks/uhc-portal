import React from 'react';
import PropTypes from 'prop-types';

import { ChartDonutUtilization, ChartDonutThreshold } from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';

import { humanizeValueWithUnit, roundValueWithUnit } from '../../../../../../common/units';

function ClusterUtilizationChart(props) {
  const {
    title, used, total, unit, humanize, donutId,
  } = props;

  const format = humanize ? humanizeValueWithUnit : roundValueWithUnit;
  const formattedUsed = format(used, unit);
  const formattedTotal = format(total, unit);

  // Step 1: used / total * 100 - calculate "used" in percentage out of the total
  // Step 2: Math.round(Step1 * 100) / 100 - round to 2 decimal places
  const usedPercentage = Math.round((used / total) * 100 * 100) / 100;
  const donutCenter = { primary: `${usedPercentage}%`, secondary: `of ${formattedTotal.value} ${formattedTotal.unit} used` };

  return (
    <div>
      <Title className="metrics-chart" headingLevel="h4" size="xl">{title}</Title>
      <div className="metrics-chart">
        <ChartDonutThreshold
          ariaDesc={title}
          data={[{ x: '', y: 80 }, { x: 'Warning at 80%', y: 95 }, { x: 'Danger at 95%', y: 100 }]}
          labels={({ datum }) => datum.x || null}
        >
          <ChartDonutUtilization
            id={donutId}
            title={donutCenter.primary}
            subTitle={donutCenter.secondary}
            data={{ x: `${formattedUsed.value} ${formattedUsed.unit}`, y: usedPercentage }}
            thresholds={[{ value: 80 }, { value: 95 }]}
          />
        </ChartDonutThreshold>
      </div>
    </div>
  );
}

ClusterUtilizationChart.propTypes = {
  title: PropTypes.string.isRequired,
  used: PropTypes.number,
  total: PropTypes.number,
  unit: PropTypes.string,
  humanize: PropTypes.bool,
  donutId: PropTypes.string.isRequired,
};

export default ClusterUtilizationChart;
