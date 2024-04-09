import React from 'react';

import { Text, TextContent } from '@patternfly/react-core';

import PageTitle from '../../../common/PageTitle';

interface InstructionsChooserPageTitleProps {
  cloudName: string;
  breadcrumbs: React.ReactNode;
}

export const InstructionsChooserPageTitle = ({
  cloudName,
  breadcrumbs,
}: InstructionsChooserPageTitleProps) => (
  <PageTitle title={`Create an OpenShift Cluster: ${cloudName}`} breadcrumbs={breadcrumbs}>
    <TextContent className="pf-v5-u-mt-sm">
      <Text component="p">Select the installation type that best fits your needs.</Text>
    </TextContent>
  </PageTitle>
);
