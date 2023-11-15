import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import {
  Grid,
  GridItem,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
  Title,
} from '@patternfly/react-core';

import './CostCard.scss';

class CostSummary extends Component {
  formatCurrency = (value = 0, units = 'USD') =>
    value.toLocaleString('en', {
      style: 'currency',
      currency: units,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  formatPercentage = (value = 0) =>
    value.toLocaleString('en', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  getClusters = () => {
    const { report } = this.props;

    const hasTotal =
      report &&
      report.meta &&
      report.meta.total &&
      report.meta.total.cost &&
      report.meta.total.cost.total;
    const total = hasTotal ? report.meta.total.cost.total.value : 0;

    if (!hasTotal) {
      return null;
    }

    // eslint-disable-next-line max-len
    return (
      report &&
      report.data.map((data) =>
        data.clusters.map((cluster) =>
          cluster.values.map((value) => {
            const id = value.clusters && value.clusters.length ? value.clusters[0] : value.cluster;
            const cost = value.cost && value.cost.total ? value.cost.total.value : 0;
            const units = value.cost && value.cost.total ? value.cost.total.units : 'USD';
            const percentage = total > 0 ? cost / total : 0;
            const val = `${this.formatCurrency(cost, units)} (${this.formatPercentage(
              percentage,
            )})`;

            return (
              <React.Fragment key={value.cluster}>
                <TextListItem component={TextListItemVariants.dt}>{id}</TextListItem>
                <TextListItem component={TextListItemVariants.dd}>{val}</TextListItem>
              </React.Fragment>
            );
          }),
        ),
      )
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
      <Grid hasGutter>
        <GridItem lg={5} md={12}>
          <Title className="ocm--cost-total" size="2xl" headingLevel="h2">
            {this.getTotal()}
          </Title>
          <span className="ocm--cost-total__desc">Month-to-date cost</span>
        </GridItem>
        <GridItem lg={7} md={12}>
          <div className="ocm--cost-clusters">
            <TextContent>
              <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt} key="top-clusters">
                  Top clusters
                </TextListItem>
                {this.getClusters()}
              </TextList>
            </TextContent>
          </div>
        </GridItem>
      </Grid>
    );
  }
}

CostSummary.propTypes = {
  report: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
};

export default CostSummary;
