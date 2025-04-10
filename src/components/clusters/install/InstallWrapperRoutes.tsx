import React from 'react';

import { Routes } from './models/types';
import { InstallComponentWrapper } from './InstallWrapper';
import { AlibabaProps, ArmAWSIPIProps } from './InstallWrapperPropsData';

// Example of generic install component usage
export const routesData: Routes[] = [
  {
    path: '/install/alibaba',
    element: <InstallComponentWrapper instructionChooserProps={AlibabaProps} instructionChooser />,
  },

  {
    path: '/install/aws/arm/installer-provisioned',
    element: <InstallComponentWrapper ocpInstructionProps={ArmAWSIPIProps} />,
  },
];
