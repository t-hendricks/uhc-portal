import React from 'react';
import { Popover, PopoverPosition, Label } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import links from '../../common/installLinks.mjs';
import ExternalLink from './ExternalLink';

const CooperativeCommunityBadge = () => {
  const info = (
    <>
      <div style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}>
        Cooperative Community Support provides assistance to Red Hat customers that have questions
        about community-provided software that is often used with our Red Hat products.
      </div>

      <ExternalLink href={links.COOPERATIVE_COMMUNITY_SUPPORT_KCS}>Learn more</ExternalLink>
    </>
  );
  return (
    <Popover position={PopoverPosition.top} bodyContent={info}>
      <Label
        style={{ cursor: 'pointer' }}
        color="orange"
        onClick={(event) => {
          event.preventDefault();
        }}
        icon={<InfoCircleIcon color="var(--pf-c-label__content--Color)" />}
        className="pf-u-ml-md pf-u-display-inline"
      >
        Cooperative Community
      </Label>
    </Popover>
  );
};

export default CooperativeCommunityBadge;
