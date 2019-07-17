import React from 'react';
import PropTypes from 'prop-types';

import { ChartDonut } from '@patternfly/react-charts';
// eslint-disable-next-line camelcase
import { chart_global_success_Color_100, chart_global_Fill_Color_200 } from '@patternfly/react-tokens';

import { humanizeValueWithUnit, roundValueWithUnit } from '../../../../../../common/units';

function ClusterUtilizationChart(props) {
  const {
    title, used, total, unit, humanize, donutId,
  } = props;

  const format = humanize ? humanizeValueWithUnit : roundValueWithUnit;
  const formattedUsed = format(used, unit);
  const formattedTotal = format(total, unit);
  const available = total - used;
  const donutCenter = { primary: `${formattedUsed.value} ${formattedUsed.unit}`, secondary: `of ${formattedTotal.value} ${formattedTotal.unit} used` };

  const tooltipContents = (datum) => {
    const formatted = format(datum.y, unit);
    return `${formatted.value} ${formatted.unit} ${datum.x}`;
  };

  return (
    <div>
      <h4 className="metrics-chart">
        {title}
      </h4>
      <div className="metrics-chart">
        <ChartDonut
          id={donutId}
          height={180}
          width={180}
          title={donutCenter.primary}
          subTitle={donutCenter.secondary}
          labels={datum => tooltipContents(datum)}
          data={[{ x: 'used', y: used }, { x: 'available', y: available }]}
          colorScale={[chart_global_success_Color_100.value, chart_global_Fill_Color_200.value]}
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
