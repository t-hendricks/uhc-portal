import React from 'react';
import { Popover, PopoverPosition, Label } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import links from '../../common/installLinks.mjs';
import ExternalLink from './ExternalLink';

const DevPreviewBadge = () => {
  const info = (
    <>
      <div style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}>
        Developer preview features provide early access to upcoming product innovations, enabling
        you to test functionality and provide feedback during the development process.
      </div>

      <ExternalLink href={links.INSTALL_PRE_RELEASE_SUPPORT_KCS}>Learn more</ExternalLink>
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
        Developer Preview
      </Label>
    </Popover>
  );
};

export default DevPreviewBadge;
