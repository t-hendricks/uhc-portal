import React from 'react';
import { ReactElementLike, ReactNodeLike } from 'prop-types';

import { Icon, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

type ErrorTriangleProps = {
  item?: string;
  errorMessage: string | ReactNodeLike | ReactElementLike;
};

const ErrorTriangle = ({ item = 'clusters', errorMessage }: ErrorTriangleProps) => (
  <Tooltip
    content={`An error occurred when fetching ${item}: ${errorMessage}`}
    data-testid="error-triangle"
  >
    <Icon size="lg" className="cluster-error-triangle" aria-label="Warning">
      <ExclamationTriangleIcon color={warningColor.value} />
    </Icon>
  </Tooltip>
);

export default ErrorTriangle;
