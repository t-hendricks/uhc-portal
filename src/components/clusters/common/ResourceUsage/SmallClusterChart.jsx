import React from 'react';
import PropTypes from 'prop-types';

import { ChartDonut } from '@patternfly/react-charts';

import { humanizeValueWithUnit, roundValueWithUnit } from '../../../../common/units';
import './SmallClusterChart.scss';

function SmallClusterChart(props) {
  const { used, total, unit, humanize, donutId, usedTitle, availableTitle } = props;

  const format = humanize ? humanizeValueWithUnit : roundValueWithUnit;
  const formattedUsed = format(used, unit);
  const formattedTotal = format(total, unit);
  const formattedUnused = format(total - used, unit);

  // Step 1: used / total * 100 - calculate "used" in percentage out of the total
  // Step 2: Math.round(Step1 * 100) / 100 - round to 2 decimal places
  const usedPercentage = Math.round((used / total) * 100 * 100) / 100;
  const unusedPrecentage = Math.round(((total - used) / total) * 100 * 100) / 100;
  return (
    <div>
      <div className="small-donut-chart-container">
        <ChartDonut
          id={donutId}
          labels={({ datum }) => (datum.x ? `${datum.x}` : null)}
          data={[
            { x: `${formattedUsed.value} ${formattedUsed.unit}`, y: usedPercentage },
            { x: `${formattedUnused.value} ${formattedUnused.unit}`, y: unusedPrecentage },
          ]}
          constrainToVisibleArea
          legendData={[
            { name: `${usedTitle}: ${formattedUsed.value} ${formattedUsed.unit}` },
            { name: `${availableTitle}: ${formattedUnused.value} ${formattedUnused.unit}` },
          ]}
          legendOrientation="vertical"
          padding={{
            bottom: 20,
            left: 20,
            right: 195, // Adjusted to accommodate legend
            top: 20,
          }}
          title={formattedTotal.value}
          height={205}
          width={410}
        />
      </div>
    </div>
  );
}

SmallClusterChart.propTypes = {
  used: PropTypes.number,
  total: PropTypes.number,
  unit: PropTypes.string,
  availableTitle: PropTypes.string,
  usedTitle: PropTypes.string,
  humanize: PropTypes.bool,
  donutId: PropTypes.string.isRequired,
};

export default SmallClusterChart;
