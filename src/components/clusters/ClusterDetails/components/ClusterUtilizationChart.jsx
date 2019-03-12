import React from 'react';
import PropTypes from 'prop-types';
import {
  DonutChart,
} from 'patternfly-react';
import { humanizeValueWithUnit } from '../../../../common/unitParser';


function ClusterUtilizationChart(props) {
  const {
    title, used, total, unit, donutId, usedBytes, totalBytes,
  } = props;
  let available;
  let usedValue;
  let usedColumnTitle;
  let availableColumnTitle;
  if (usedBytes !== undefined) {
    // bytes based donut, like memory or storage. We need to humanize it ourselves.
    const usedHumanized = humanizeValueWithUnit(usedBytes, 'B');
    usedValue = usedHumanized.value;

    const availableBytes = totalBytes - usedBytes;
    const availableHumanized = humanizeValueWithUnit(availableBytes, 'B');
    available = availableHumanized.value;

    usedColumnTitle = `${usedHumanized.unit} used`;
    availableColumnTitle = `${availableHumanized.unit} available`;
  } else {
    // unit provided, for example CPU
    available = total - used;
    usedValue = used;
    usedColumnTitle = `${unit} used`;
    availableColumnTitle = `${unit} available`;
  }

  // had to copy this from the patternfly storybook source code to get the tooltip :(
  const pfGetUtilizationDonutTooltipContents = d => `<span class="donut-tooltip-pf" style="white-space: nowrap;">${d[0].value} ${d[0].name}</span>`;

  return (
    <div>
      <h4 className="center">
        {title}
      </h4>
      <div className="center">
        <DonutChart
          id={donutId}
          size={{ width: 180, height: 180 }}
          data={{
            columns: [[usedColumnTitle, usedValue], [availableColumnTitle, available]],
            groups: [['used', 'available']],
            order: null,
          }}
          tooltip={{ contents: pfGetUtilizationDonutTooltipContents }}
          title={{ primary: usedValue, secondary: usedColumnTitle }}
        />
      </div>
    </div>);
}

ClusterUtilizationChart.propTypes = {
  title: PropTypes.string.isRequired,
  used: PropTypes.number,
  total: PropTypes.number,
  unit: PropTypes.string,
  usedBytes: PropTypes.number,
  totalBytes: PropTypes.number,
  donutId: PropTypes.string.isRequired,
};

export default ClusterUtilizationChart;
