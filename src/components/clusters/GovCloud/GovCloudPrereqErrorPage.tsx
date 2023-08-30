import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  TextContent,
  Title,
} from '@patternfly/react-core';
import * as React from 'react';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const GovCloudPrereqErrorPage = ({ message }: { message: string }) => (
  <EmptyState>
    <EmptyStateIcon
      icon={(props) => <ExclamationCircleIcon {...props} color={dangerColor.value} />}
    />
    <Title headingLevel="h4" size="lg">
      Failed to verify GovCloud prerequisities
    </Title>
    <EmptyStateBody>
      <TextContent className="pf-u-mb-md">{message}</TextContent>
      <Button variant="link" iconPosition="right" isInline onClick={() => window.location.reload()}>
        Try refreshing the page.
      </Button>
    </EmptyStateBody>
  </EmptyState>
);

export default GovCloudPrereqErrorPage;
