import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { ReactElementLike, ReactNodeLike } from 'prop-types';
import React from 'react';
import { Tooltip } from '@patternfly/react-core';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens';

type ErrorTriangleProps = {
  item?: string;
  errorMessage: string | ReactNodeLike | ReactElementLike;
};

const ErrorTriangle = ({ item = 'clusters', errorMessage }: ErrorTriangleProps) => (
  <Tooltip
    content={`An error occurred when fetching ${item}: ${errorMessage}`}
    data-testid="error-triangle"
  >
    <ExclamationTriangleIcon
      size="lg"
      className="cluster-error-triangle"
      color={global_warning_color_100.value}
    />
  </Tooltip>
);

export default ErrorTriangle;
