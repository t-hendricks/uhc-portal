import React from 'react';

import { RadioDescription } from '~/components/common/RadioDescription';

import { IMDSType } from '../../../constants';

export type ImdsOptionType = {
  value: IMDSType;
  ariaLabel: string;
  label: React.ReactNode;
};

export const imdsOptions: ImdsOptionType[] = [
  {
    value: IMDSType.V1AndV2,
    ariaLabel: 'Both IMDSv1 and IMDSv2',
    label: (
      <>
        Use both IMDSv1 and IMDSv2
        <div className="pf-v5-u-mb-sm">
          <RadioDescription>
            Allows use of both IMDS versions for backward compatibility
          </RadioDescription>
        </div>
      </>
    ),
  },
  {
    value: IMDSType.V2Only,
    ariaLabel: 'IMDSv2 only',
    label: (
      <>
        Use IMDSv2 only
        <div className="pf-v5-u-mb-sm">
          <RadioDescription>A session-oriented method with enhanced security</RadioDescription>
        </div>
      </>
    ),
  },
];
