import React from 'react';
import PropTypes from 'prop-types';

import { ChartDonutUtilization, ChartDonutThreshold } from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';

import { humanizeValueWithUnit, roundValueWithUnit } from '../../../../common/units';

function ClusterUtilizationChart(props) {
  const {
    title, used, total, unit, humanize, donutId, type,
  } = props;

  const format = humanize ? humanizeValueWithUnit : roundValueWithUnit;
  const formattedUsed = format(used, unit);
  const formattedTotal = format(total, unit);
  const formattedUnused = format(total - used, unit);

  // Step 1: used / total * 100 - calculate "used" in percentage out of the total
  // Step 2: Math.round(Step1 * 100) / 100 - round to 2 decimal places
  const usedPercentage = Math.round((used / total) * 100 * 100) / 100;
  const donutCenter = { primary: `${usedPercentage}%`, secondary: `of ${formattedTotal.value} ${formattedTotal.unit} used` };

  const baseDonutUtilization = extraProps => (
    <ChartDonutUtilization
      id={donutId}
      title={donutCenter.primary}
      subTitle={donutCenter.secondary}
      data={{ x: `${formattedUsed.value} ${formattedUsed.unit}`, y: usedPercentage }}
      thresholds={[{ value: 80 }, { value: 95 }]}
      {...extraProps}
    />
  );

  const donutChartWithThreshold = (
    <div>
      <Title className="metrics-chart chart-title" headingLevel="h4" size="xl">{title}</Title>
      <div className="metrics-chart">
        <ChartDonutThreshold
          ariaDesc={title}
          data={[{ x: '', y: 80 }, { x: 'Warning at 80%', y: 95 }, { x: 'Danger at 95%', y: 100 }]}
          labels={({ datum }) => datum.x || null}
          height={185}
          width={185}
          subTitlePosition="bottom"
          padding={{ bottom: 24 }}
        >
          {baseDonutUtilization()}
        </ChartDonutThreshold>
      </div>
    </div>
  );

  const legendExtraProps = {
    labels: ({ datum }) => (datum.x ? `${datum.x}` : null),
    constrainToVisibleArea: true,
    legendData: [{ name: `Used: ${formattedUsed.value} ${formattedUsed.unit}` }, { name: `Available: ${formattedUnused.value} ${formattedUnused.unit}` }],
    legendOrientation: 'vertical',
    padding: {
      bottom: 20,
      left: 20,
      right: 195, // Adjusted to accommodate legend
      top: 20,
    },
    height: 205,
    width: 410,
  };

  const donutChartWithLegend = (
    <div>
      <Title className="metrics-chart chart-title-with-legend" headingLevel="h4" size="xl">{title}</Title>
      <div className="metrics-chart chart-with-legend">
        {baseDonutUtilization(legendExtraProps)}
      </div>
    </div>
  );

  switch (type) {
    case 'legend':
      return (
        <>
          {donutChartWithLegend}
        </>
      );
    default:
      return (
        <>
          {donutChartWithThreshold}
        </>
      );
  }
}

ClusterUtilizationChart.propTypes = {
  title: PropTypes.string.isRequired,
  used: PropTypes.number,
  total: PropTypes.number,
  unit: PropTypes.string,
  humanize: PropTypes.bool,
  donutId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ClusterUtilizationChart;
