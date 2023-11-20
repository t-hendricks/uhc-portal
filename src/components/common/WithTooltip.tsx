import { Tooltip } from '@patternfly/react-core';
import * as React from 'react';

type WithTooltipProps = {
  showTooltip: boolean;
  content: React.ReactNode;
  children: React.ReactElement;
};

const WithTooltip = ({ showTooltip, content, children }: WithTooltipProps) =>
  showTooltip ? <Tooltip content={content}>{children}</Tooltip> : children;

export default WithTooltip;
