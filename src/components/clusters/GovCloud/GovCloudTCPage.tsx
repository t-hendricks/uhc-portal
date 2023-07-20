import { Button, EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';
import * as React from 'react';
import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens';
import { ExclamationCircleIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

const GovCloudTCPage = ({ redirectURL }: { redirectURL: string }) => (
  <EmptyState>
    <EmptyStateIcon
      icon={(props) => <ExclamationCircleIcon {...props} color={dangerColor.value} />}
    />
    <Title headingLevel="h4" size="lg">
      Signed agreement not detected
    </Title>
    <EmptyStateBody>
      You need to sign the Enterprise agreement and Appendix4 to proceed
      <br />
      <Button
        variant="link"
        icon={<ExternalLinkAltIcon />}
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
