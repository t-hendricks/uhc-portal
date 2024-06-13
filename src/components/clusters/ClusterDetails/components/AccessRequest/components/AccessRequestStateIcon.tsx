import React from 'react';

import { Label } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationTriangleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';
import { OutlinedClockIcon } from '@patternfly/react-icons/dist/esm/icons/outlined-clock-icon';
import { TimesCircleIcon } from '@patternfly/react-icons/dist/esm/icons/times-circle-icon';

import { AccessRequest } from '~/types/access_transparency.v1';

import { AccessRequestState } from '../model/AccessRequestState';

type AccessRequestStateIconProps = {
  accessRequest?: AccessRequest;
};

const stateStyles: {
  [state in AccessRequestState]: {
    color?: 'blue' | 'cyan' | 'green' | 'orange' | 'purple' | 'red' | 'grey' | 'gold';
    icon?: React.ReactNode;
  };
} = {
  [AccessRequestState.PENDING]: {
    color: 'orange',
    icon: <ExclamationTriangleIcon />,
  },
  [AccessRequestState.APPROVED]: {
    color: 'green',
    icon: <CheckCircleIcon />,
  },
  [AccessRequestState.DENIED]: {
    color: 'red',
    icon: <TimesCircleIcon />,
  },
  [AccessRequestState.EXPIRED]: {
    icon: <OutlinedClockIcon />,
  },
};

const AccessRequestStateIcon = ({ accessRequest }: AccessRequestStateIconProps) =>
  accessRequest?.status?.state ? (
    <Label
      color={stateStyles[accessRequest.status.state as AccessRequestState].color}
      icon={stateStyles[accessRequest.status.state as AccessRequestState].icon}
    >
      {accessRequest.status.state}
    </Label>
  ) : null;

export default AccessRequestStateIcon;
