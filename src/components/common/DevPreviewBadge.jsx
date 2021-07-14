import React from 'react';
import {
  Popover, PopoverPosition, Label,
} from '@patternfly/react-core';

import ExternalLink from './ExternalLink';

function DevPreviewBadge() {
  const info = (
    <>
      <div style={{ marginBottom: 'var(--pf-global--spacer--sm)' }}>
        Developer preview features provide early access to upcoming product innovations,
        enabling you to test functionality and provide feedback during the development process.
      </div>

      <ExternalLink href="https://access.redhat.com/articles/4307871">
        Learn more
      </ExternalLink>
    </>
  );
  return (
    <Popover position={PopoverPosition.top} bodyContent={info}>
      <Label color="orange">Developer Preview</Label>
    </Popover>
  );
}

export default DevPreviewBadge;
