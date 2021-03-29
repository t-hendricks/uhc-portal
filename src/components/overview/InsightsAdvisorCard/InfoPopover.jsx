import React from 'react';
import { Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_Color_dark_200 } from '@patternfly/react-tokens';

import ExternalLink from '../../common/ExternalLink';

const InfoPopover = () => (
  <Popover
    className="ocm-insights--info-popover"
    aria-label="What is Insights?"
    position="left"
    maxWidth="25rem"
    enableFlip
    bodyContent={(
      <>
        <p>
            Insights identifies and prioritizes risks to security, performance,
            availability, and stability of your clusters.
        </p>
        <p>
            This feature uses the Remote Health functionality of OpenShift Container Platform.
            For further details about Insights, see the
          {' '}
          <ExternalLink href="https://docs.openshift.com/container-platform/latest/support/remote_health_monitoring/using-insights-to-identify-issues-with-your-cluster.html">
            OpenShift documentation
          </ExternalLink>
          .
        </p>
      </>
              )}
  >
    <HelpIcon className="ocm-insights--risk-chart__popover-icon" color={global_Color_dark_200.value} />
  </Popover>
);

export default InfoPopover;
