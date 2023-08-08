import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import { Title } from '@patternfly/react-core';
import { ChartLabel, ChartLegend, ChartPie } from '@patternfly/react-charts';

import './CostBreakdownCard.scss';

const CHART_HEIGHT = 185;
const CHART_WIDTH = 350;

class CostBreakdownSummary extends Component {
  formatCurrency = (value = 0, units = 'USD') =>
    value.toLocaleString('en', {
      style: 'currency',
      currency: units,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  getChart = () => {
    const { report } = this.props;

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

    const markup = this.formatCurrency(
      hasMarkup ? report.meta.total.cost.markup.value : 0,
      markupUnits,
    );
    const raw = this.formatCurrency(hasRaw ? report.meta.total.cost.raw.value : 0, rawUnits);
    const usage = this.formatCurrency(
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
        labels={({ datum }) => `${datum.x}: ${this.formatCurrency(datum.y, datum.units)}`}
        legendComponent={this.getLegend([raw, markup, usage])}
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

  // Override legend label layout
  getLegendLabel =
    () =>
    ({ values, ...props }) =>
      (
        <ChartLabel
          {...props}
          style={[{ fontWeight: 600 }, {}]}
          text={[values[props.index], props.text]}
        />
      );

  getLegend = (values) => {
    const LegendLabel = this.getLegendLabel();
    return (
      <ChartLegend
        gutter={25}
        itemsPerRow={2}
        labelComponent={<LegendLabel dy={10} lineHeight={1.5} values={values} />}
        rowGutter={20}
      />
    );
  };

  getTotal = () => {
    const { report } = this.props;

    const hasTotal =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total;
    const total = hasTotal ? report.meta.total.cost.total.value : 0;
    const units = hasTotal ? report.meta.total.cost.total.units : 'USD';

    return this.formatCurrency(total, units);
  };

  render() {
    const { report } = this.props;

    if (!report.fulfilled) {
      return <Skeleton size="md" />;
    }

    return (
      <>
        <Title className="ocm--cost-title" size="md" headingLevel="h2">
          Total cost
          <span className="ocm--cost-total"> {this.getTotal()}</span>
        </Title>
        <div style={{ maxHeight: CHART_HEIGHT, maxWidth: CHART_WIDTH }}>{this.getChart()}</div>
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
  values: PropTypes.array,
};

export default CostBreakdownSummary;
