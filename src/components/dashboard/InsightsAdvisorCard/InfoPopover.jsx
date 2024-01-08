import React from 'react';
import { Popover, Icon } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons/dist/esm/icons/help-icon';
// eslint-disable-next-line camelcase
import { global_Color_dark_200 } from '@patternfly/react-tokens/dist/esm/global_Color_dark_200';

import links from '../../../common/installLinks.mjs';
import ExternalLink from '../../common/ExternalLink';

const InfoPopover = () => (
  <Popover
    className="ocm-insights--info-popover"
    aria-label="What is Insights?"
    position="left"
    maxWidth="25rem"
    enableFlip
    bodyContent={
      <>
        <p>
          Insights identifies and prioritizes risks to security, performance, availability, and
          stability of your clusters.
        </p>
        <p>
          This feature uses the Remote Health functionality of OpenShift Container Platform. For
          further details about Insights, see the{' '}
          <ExternalLink href={links.REMOTE_HEALTH_INSIGHTS}>OpenShift documentation</ExternalLink>.
        </p>
      </>
    }
  >
    <Icon className="ocm-insights--info-popover__icon">
      <HelpIcon color={global_Color_dark_200.value} />
    </Icon>
  </Popover>
);

export default InfoPopover;
