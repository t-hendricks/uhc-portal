import React from 'react';
import PropTypes from 'prop-types';

import {
  Card, CardHeader, CardBody, Title,
} from '@patternfly/react-core';

import get from 'lodash/get';


function Insights({ cluster }) {
  return (
    <Card>
      <CardHeader>
        <Title headingLevel="h2" size="3xl">Insights</Title>
      </CardHeader>
      <CardBody>
        {get(cluster, 'external_id', 'N/A')}
      </CardBody>
    </Card>
  );
}

Insights.propTypes = {
  cluster: PropTypes.object,
};

export default Insights;
