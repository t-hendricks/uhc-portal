import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  TextContent,
  EmptyStateHeader,
  Icon,
} from '@patternfly/react-core';
import * as React from 'react';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

const GovCloudPrereqErrorPage = ({ message }: { message: string }) => (
  <EmptyState>
    <EmptyStateHeader
      titleText="Failed to verify GovCloud prerequisites"
      icon={
        <EmptyStateIcon
          icon={(props) => (
            <Icon {...props}>
              <ExclamationCircleIcon color={dangerColor.value} />
            </Icon>
          )}
        />
      }
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
