import * as React from 'react';

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Icon,
} from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { global_palette_green_500 as okColor } from '@patternfly/react-tokens/dist/esm/global_palette_green_500';

const EmptyIcon = (props: any) => (
  <Icon {...props}>
    <CheckCircleIcon color={okColor.value} />
  </Icon>
);

const GovCloudConfirm = () => (
  <EmptyState>
    <EmptyStateHeader
      titleText="Submission confirmation"
      icon={<EmptyStateIcon icon={EmptyIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody>
      Thank you for completing the GovCloud access form.
      <br />
      You will receive an email in 3-5 business days about the next steps.
    </EmptyStateBody>
  </EmptyState>
);

export default GovCloudConfirm;
