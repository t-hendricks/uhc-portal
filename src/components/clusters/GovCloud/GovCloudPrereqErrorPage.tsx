import * as React from 'react';

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Icon,
  TextContent,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';

const EmptyIcon = (props: any) => (
  <Icon {...props}>
    <ExclamationCircleIcon color={dangerColor.value} />
  </Icon>
);

const GovCloudPrereqErrorPage = ({ message }: { message: string }) => (
  <EmptyState>
    <EmptyStateHeader
      titleText="Failed to verify GovCloud prerequisites"
      icon={<EmptyStateIcon icon={EmptyIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody>
      <TextContent className="pf-v5-u-mb-md">{message}</TextContent>
      <Button variant="link" iconPosition="right" isInline onClick={() => window.location.reload()}>
        Try refreshing the page.
      </Button>
    </EmptyStateBody>
  </EmptyState>
);

export default GovCloudPrereqErrorPage;
