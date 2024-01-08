import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { ReactElementLike, ReactNodeLike } from 'prop-types';
import React from 'react';
import { Tooltip, Icon } from '@patternfly/react-core';
// eslint-disable-next-line camelcase
import { global_warning_color_100 } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

type ErrorTriangleProps = {
  item?: string;
  errorMessage: string | ReactNodeLike | ReactElementLike;
};

const ErrorTriangle = ({ item = 'clusters', errorMessage }: ErrorTriangleProps) => (
  <Tooltip
    content={`An error occurred when fetching ${item}: ${errorMessage}`}
    data-testid="error-triangle"
  >
    <Icon size="lg" className="cluster-error-triangle">
      <ExclamationTriangleIcon color={global_warning_color_100.value} />
    </Icon>
  </Tooltip>
);

export default ErrorTriangle;
