import React from 'react';
import { Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
// eslint-disable-next-line camelcase
import { global_Color_dark_200 } from '@patternfly/react-tokens';

import links from '../../../common/installLinks';
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
          <ExternalLink href={links.REMOTE_HEALTH_INSIGHTS}>
            OpenShift documentation
          </ExternalLink>
          .
        </p>
      </>
              )}
  >
    <HelpIcon className="ocm-insights--info-popover__icon" color={global_Color_dark_200.value} />
  </Popover>
);

export default InfoPopover;
