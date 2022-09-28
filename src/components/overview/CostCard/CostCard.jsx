import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter, CardTitle, Title } from '@patternfly/react-core';

import CostEmptyState from './CostEmptyState';
import CostSummary from './CostSummary';

import './CostCard.scss';

class CostCard extends Component {
  componentDidMount() {
    this.refresh();
  }

  getBaseName = () => {
    let release = '/';
    const pathName = window.location.pathname.split('/');

    pathName.shift();

    if (pathName[0] === 'beta') {
      pathName.shift();
      release = '/beta/';
    }
    return `${release}${pathName[0]}`;
  };

  refresh = () => {
    const { getReport, getSources } = this.props;

    getReport();
    getSources({ type: 'OCP' });
  };

  render() {
    const { report, sources } = this.props;
    const hasSources = sources && sources.meta && sources.meta.count !== 0;

    return (
      <Card className="ocm--cost-card">
        <CardTitle>
          <Title size="lg" headingLevel="h2">
            Cost Management
          </Title>
        </CardTitle>
        <CardBody className="ocm--cost-card__body">
          {!hasSources && sources.fulfilled ? <CostEmptyState /> : <CostSummary report={report} />}
        </CardBody>
        {hasSources && report.fulfilled && (
          <CardFooter>
            <a href={`${this.getBaseName()}/cost-management`}>View more in Cost management</a>
          </CardFooter>
        )}
      </Card>
    );
  }
}

CostCard.propTypes = {
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

export default CostCard;
