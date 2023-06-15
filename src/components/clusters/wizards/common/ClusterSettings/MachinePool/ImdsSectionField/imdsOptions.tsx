import React from 'react';
import { IMDSType } from '../../../constants';

export const imdsOptions = [
  {
    value: IMDSType.V1AndV2,
    ariaLabel: 'Both IMDSv1 and IMDSv2',
    label: (
      <>
        Use both IMDSv1 and IMDSv2
        <div className="ocm-c--reduxradiobutton-description pf-u-mb-sm">
          Allows use of both IMDS versions for backward compatibility
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
        <div className="ocm-c--reduxradiobutton-description pf-u-mb-sm">
          A session-oriented method with enhanced security
        </div>
      </>
    ),
  },
];
