import React from 'react';
import { BellSlashIcon } from '@patternfly/react-icons';
import { Label } from '@patternfly/react-core';

const DisabledTooltip = () => (
  <Label className="disabled-tooltip">
    <BellSlashIcon />
    Disabled
  </Label>
);

export default DisabledTooltip;
