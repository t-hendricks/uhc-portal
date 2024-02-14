import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { Title } from '@patternfly/react-core';
import { ChartLabel, ChartLegend, ChartPie } from '@patternfly/react-charts';

import './CostBreakdownCard.scss';

const CHART_HEIGHT = 185;
const CHART_WIDTH = 350;

const LegendLabel = ({ values, ...props }) => (
  <ChartLabel
    {...props}
    style={[{ fontWeight: 600 }, {}]}
    text={[values[props.index], props.text]}
  />
);

LegendLabel.propTypes = {
  values: PropTypes.array,
  index: PropTypes.any,
  text: PropTypes.any,
};

const getLegendLabel = () => LegendLabel;

class CostBreakdownSummary extends Component {
  static formatCurrency = (value = 0, units = 'USD') =>
    value.toLocaleString('en', {
      style: 'currency',
      currency: units,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  static getChart = (report) => {
    const hasCost = report && report.meta && report.meta.total && report.meta.total.cost;
    const hasMarkup = hasCost && report.meta.total.cost.markup;
    const hasRaw = hasCost && report.meta.total.cost.raw;
    const hasUsage = hasCost && report.meta.total.cost.usage;

    const markupUnits = hasMarkup ? report.meta.total.cost.markup.units : 'USD';
    const rawUnits = hasRaw ? report.meta.total.cost.raw.units : 'USD';
    const usageUnits = hasUsage ? report.meta.total.cost.usage.units : 'USD';

    const markupValue = hasMarkup ? report.meta.total.cost.markup.value : 0;
    const rawValue = hasRaw ? report.meta.total.cost.raw.value : 0;
    const usageValue = hasUsage ? report.meta.total.cost.usage.value : 0;

    const markup = CostBreakdownSummary.formatCurrency(
      hasMarkup ? report.meta.total.cost.markup.value : 0,
      markupUnits,
    );
    const raw = CostBreakdownSummary.formatCurrency(
      hasRaw ? report.meta.total.cost.raw.value : 0,
      rawUnits,
    );
    const usage = CostBreakdownSummary.formatCurrency(
      hasUsage ? report.meta.total.cost.usage.value : 0,
      usageUnits,
    );

    const markupLabel = 'Markup';
    const rawLabel = 'Raw cost';
    const usageLabel = 'Usage cost';

    return (
      <ChartPie
        ariaDesc="Cost breakdown"
        constrainToVisibleArea
        data={[
          { x: rawLabel, y: rawValue, units: rawUnits },
          { x: markupLabel, y: markupValue, units: markupUnits },
          { x: usageLabel, y: usageValue, units: usageUnits },
        ]}
        height={CHART_HEIGHT}
        labels={({ datum }) =>
          `${datum.x}: ${CostBreakdownSummary.formatCurrency(datum.y, datum.units)}`
        }
        legendComponent={CostBreakdownSummary.getLegend([raw, markup, usage])}
        legendData={[
          {
            name: rawLabel,
          },
          {
            name: markupLabel,
          },
          {
            name: usageLabel,
          },
        ]}
        legendOrientation="vertical"
        legendPosition="right"
        padding={{
          bottom: 30,
          left: 0,
          right: 225, // Adjusted to accommodate legend
          top: 30,
        }}
        legendAllowWrap
        width={CHART_WIDTH}
      />
    );
  };

  static getLegend = (values) => {
    const LegendLabel = getLegendLabel();
    return (
      <ChartLegend
        gutter={25}
        itemsPerRow={2}
        labelComponent={<LegendLabel dy={10} lineHeight={1.5} values={values} />}
        rowGutter={20}
      />
    );
  };

  static getTotal = (report) => {
    const hasTotal =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total;
    const total = hasTotal ? report.meta.total.cost.total.value : 0;
    const units = hasTotal ? report.meta.total.cost.total.units : 'USD';

    return CostBreakdownSummary.formatCurrency(total, units);
  };

  render() {
    const { report } = this.props;

    return !report.fulfilled ? (
      <Skeleton size="md" />
    ) : (
      <>
        <Title className="ocm--cost-title" size="md" headingLevel="h2">
          Total cost
          <span className="ocm--cost-total"> {CostBreakdownSummary.getTotal(report)}</span>
        </Title>
        <div style={{ maxHeight: CHART_HEIGHT, maxWidth: CHART_WIDTH }}>
          {CostBreakdownSummary.getChart(report)}
        </div>
      </>
    );
  }
}

CostBreakdownSummary.propTypes = {
  report: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
};

export default CostBreakdownSummary;
