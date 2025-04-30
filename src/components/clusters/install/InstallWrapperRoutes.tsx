import React from 'react';

import { Routes } from './models/types';
import { InstallComponentWrapper } from './InstallWrapper';
import {
  AlibabaProps,
  ArmAWSIPIProps,
  ArmAwsProps,
  ArmAWSUPIProps,
  ArmAzureIPIProps,
  ArmBareMetalABIProps,
  ArmBareMetalIPIProps,
  ArmBareMetalProps,
  ArmBareMetalUPIProps,
  ArmPreReleaseProps,
  ASHIPIProps,
  ASHUPIProps,
  AWSIPIProps,
  AWSUPIProps,
  GCPIPIProps,
  GCPProps,
  GCPUPIProps,
  IBMCloudProps,
  IBMZABIProps,
  IBMZPreReleaseProps,
  IBMZProps,
  IBMZUPIProps,
} from './InstallWrapperPropsData';

// Example of generic install component usage
export const routesData: Routes[] = [
  {
    path: '/install/alibaba',
    element: (
      <InstallComponentWrapper propsData={AlibabaProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/aws/arm',
    element: (
      <InstallComponentWrapper propsData={ArmAwsProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/aws/arm/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={ArmAWSIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/arm/pre-release',
    element: (
      <InstallComponentWrapper
        propsData={ArmPreReleaseProps}
        componentChooser="releaseInstructions"
      />
    ),
  },
  {
    path: '/install/azure-stack-hub/installer-provisioned',
    element: <InstallComponentWrapper propsData={ASHIPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/azure-stack-hub/user-provisioned',
    element: <InstallComponentWrapper propsData={ASHUPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/aws/installer-provisioned',
    element: <InstallComponentWrapper propsData={AWSIPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/aws/user-provisioned',
    element: <InstallComponentWrapper propsData={AWSUPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/aws/arm/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={ArmAWSUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/azure/arm/installer-provisioned',
    element: (
      <InstallComponentWrapper propsData={ArmAzureIPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/arm',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalProps}
        componentChooser="instructionsChooser"
      />
    ),
  },
  {
    path: '/install/arm/agent-based',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalABIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/arm/installer-provisioned',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalIPIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/arm/user-provisioned',
    element: (
      <InstallComponentWrapper
        propsData={ArmBareMetalUPIProps}
        componentChooser="ocpInstructions"
      />
    ),
  },
  {
    path: '/install/gcp',
    element: (
      <InstallComponentWrapper propsData={GCPProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/gcp/installer-provisioned',
    element: <InstallComponentWrapper propsData={GCPIPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/gcp/user-provisioned',
    element: <InstallComponentWrapper propsData={GCPUPIProps} componentChooser="ocpInstructions" />,
  },
  {
    path: '/install/ibm-cloud',
    element: (
      <InstallComponentWrapper propsData={IBMCloudProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/ibmz',
    element: (
      <InstallComponentWrapper propsData={IBMZProps} componentChooser="instructionsChooser" />
    ),
  },
  {
    path: '/install/ibmz/agent-based',
    element: (
      <InstallComponentWrapper propsData={IBMZABIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/ibmz/user-provisioned',
    element: (
      <InstallComponentWrapper propsData={IBMZUPIProps} componentChooser="ocpInstructions" />
    ),
  },
  {
    path: '/install/ibmz/pre-release',
    element: (
      <InstallComponentWrapper
        propsData={IBMZPreReleaseProps}
        componentChooser="releaseInstructions"
      />
    ),
  },
];
