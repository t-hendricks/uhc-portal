import React from 'react';
import { ReactElementLike, ReactNodeLike } from 'prop-types';

import { Icon, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { t_global_icon_color_status_warning_default as warningColor } from '@patternfly/react-tokens/dist/esm/t_global_icon_color_status_warning_default';

type ErrorTriangleProps = {
  item?: string;
  errorMessage: string | ReactNodeLike | ReactElementLike;
};

const ErrorTriangle = ({ item = 'clusters', errorMessage }: ErrorTriangleProps) => (
  <Tooltip
    content={`An error occurred when fetching ${item}${errorMessage ? `: ${errorMessage}` : '.'}`}
    data-testid="error-triangle"
  >
    <Icon
      size="lg"
      className="cluster-error-triangle"
      aria-label="Warning"
      data-testid="error-triangle-icon"
    >
      <ExclamationTriangleIcon color={warningColor.value} />
    </Icon>
  </Tooltip>
);

export default ErrorTriangle;
