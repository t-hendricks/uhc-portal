import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import * as React from 'react';
import { global_palette_green_500 as okColor } from '@patternfly/react-tokens/dist/js/global_palette_green_500';
import { CheckCircleIcon } from '@patternfly/react-icons';

const GovCloudConfirm = () => (
  <EmptyState>
    <EmptyStateIcon icon={(props) => <CheckCircleIcon {...props} color={okColor.value} />} />
    <Title headingLevel="h4" size="lg">
      Submission confirmation
    </Title>
    <EmptyStateBody>
      Thank you for completing the GovCloud access form.
      <br />
      You will receive an email in 3-5 business days about the next steps.
    </EmptyStateBody>
  </EmptyState>
);

export default GovCloudConfirm;
