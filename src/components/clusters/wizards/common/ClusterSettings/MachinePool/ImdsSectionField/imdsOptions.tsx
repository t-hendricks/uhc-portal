import React from 'react';
import { IMDSType } from '../../../constants';

export const imdsOptions = [
  {
    value: IMDSType.Optional,
    ariaLabel: 'Both IMDSv1 and IMDSv2',
    label: (
      <>
        Use both IMDSv1 and IMDSv2
        <div className="ocm-c--reduxradiobutton-description">
          Allows use of both IMDS versions for backward compatibility
        </div>
      </>
    ),
  },
  {
    value: IMDSType.Required,
    ariaLabel: 'IMDSv2 only',
    label: (
      <>
        Use IMDSv2 only
        <div className="ocm-c--reduxradiobutton-description">
          A session-oriented method with enhanced security
        </div>
      </>
    ),
  },
];
