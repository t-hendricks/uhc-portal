import React from 'react';
import PropTypes from 'prop-types';
import {
  DonutChart,
} from 'patternfly-react';
import { humanizeValueWithUnit, roundValueWithUnit } from '../../../../../../common/units';

function ClusterUtilizationChart(props) {
  const {
    title, used, total, unit, humanize, donutId,
  } = props;

  const format = humanize ? humanizeValueWithUnit : roundValueWithUnit;
  const formattedUsed = format(used, unit);
  const donutCenter = { primary: `${formattedUsed.value}`, secondary: `${formattedUsed.unit} used` };
  const available = total - used;

  // Based on pfGetUtilizationDonutTooltipContents from patternfly storybook, changed for our needs.
  // Example input: d=[{"id":"used","value":6.2831853,"ratio":0.48320355,"index":0,"name":"used"}]
  const tooltipContents = (d) => {
    const formatted = format(d[0].value, unit);
    return `<span class="donut-tooltip-pf" style="white-space: nowrap;">${formatted.value} ${formatted.unit} ${d[0].name}</span>`;
  };

  return (
    <div>
      <h4 className="center">
        {title}
      </h4>
      <div className="center">
        <DonutChart
          id={donutId}
          size={{ width: 180, height: 180 }}
          title={donutCenter}
          data={{
            columns: [['used', used], ['available', available]],
            order: null, // the order the data was loaded
          }}
          tooltip={{
            contents: tooltipContents,
          }}
        />
      </div>
    </div>);
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
