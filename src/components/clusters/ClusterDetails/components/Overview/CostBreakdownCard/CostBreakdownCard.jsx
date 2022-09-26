import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';

import CostEmptyState from '../../../../../overview/CostCard/CostEmptyState';
import CostBreakdownSummary from './CostBreakdownSummary';

import './CostBreakdownCard.scss';

class CostBreakdownCard extends Component {
  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    const { clusterId, getReport, getSources } = this.props;

    // Filter example: cluster = ['a94ea9bc-9e4f-4b91-89c2-c7099ec08427']
    getReport({
      filter: {
        cluster: clusterId,
      },
    });
    getSources({ type: 'OCP' });
  };

  render() {
    const { report, sources } = this.props;
    const hasSources = sources && sources.meta && sources.meta.count !== 0;

    return (
      <Card className="ocm--cost-breakdown-card">
        <CardTitle>
          <Title size="lg" headingLevel="h2">
            Cost breakdown
          </Title>
        </CardTitle>
        <CardBody className="ocm--cost-breakdown-card__body">
          {!hasSources && sources.fulfilled ? (
            <CostEmptyState />
          ) : (
            <CostBreakdownSummary report={report} />
          )}
        </CardBody>
      </Card>
    );
  }
}

CostBreakdownCard.propTypes = {
  clusterId: PropTypes.string,
  getReport: PropTypes.func.isRequired,
  getSources: PropTypes.func.isRequired,
  report: PropTypes.shape({
    data: PropTypes.array,
    meta: PropTypes.object,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
  sources: PropTypes.shape({
    meta: PropTypes.object,
    pending: PropTypes.bool,
    fulfilled: PropTypes.bool,
  }).isRequired,
};

export default CostBreakdownCard;
