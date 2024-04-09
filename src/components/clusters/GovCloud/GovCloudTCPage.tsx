import * as React from 'react';

import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Icon,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/esm/global_danger_color_100';

const EmptyIcon = (props: any) => (
  <Icon>
    <ExclamationCircleIcon {...props} color={dangerColor.value} />
  </Icon>
);

const GovCloudTCPage = ({ redirectURL }: { redirectURL: string }) => (
  <EmptyState>
    <EmptyStateHeader
      titleText="Signed agreement not detected"
      icon={<EmptyStateIcon icon={EmptyIcon} />}
      headingLevel="h4"
    />
    <EmptyStateBody>
      You need to sign the Enterprise agreement and Appendix4 to proceed
      <br />
      <Button
        variant="link"
        icon={
          <Icon>
            <ExternalLinkAltIcon />
          </Icon>
        }
        iconPosition="right"
        isInline
        onClick={() => window.location.assign(`${redirectURL}&redirect=${window.location.href}`)}
      >
        Sign them here.
      </Button>
    </EmptyStateBody>
  </EmptyState>
);

export default GovCloudTCPage;
