import React from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';

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
    <TextContent className={spacing.mtSm}>
      <Text component="p">Select the installation type that best fits your needs.</Text>
    </TextContent>
  </PageTitle>
);
