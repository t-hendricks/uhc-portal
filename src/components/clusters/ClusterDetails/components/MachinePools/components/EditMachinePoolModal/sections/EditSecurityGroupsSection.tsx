import React from 'react';
import { Alert, AlertActionLink, ExpandableSection } from '@patternfly/react-core';

import { SECURITY_GROUPS_FEATURE } from '~/redux/constants/featureConstants';

import { Cluster } from '~/types/clusters_mgmt.v1';
import WithTooltip from '~/components/common/WithTooltip';
import { isCompatibleFeature, SupportedFeature } from '~/common/featureCompatibility';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import links from '~/common/installLinks.mjs';
import EditSecurityGroupsField from './EditSecurityGroupsField';

export interface EditSecurityGroupsSectionProps {
  cluster: Cluster;
  isReadOnly: boolean;
}

const EditSecurityGroupsSection = ({ cluster, isReadOnly }: EditSecurityGroupsSectionProps) => {
  const hasFeatureGate = useFeatureGate(SECURITY_GROUPS_FEATURE);
  const showSecurityGroupSection =
    hasFeatureGate &&
    isCompatibleFeature(SupportedFeature.SECURITY_GROUPS, cluster, { day2: true });

  return showSecurityGroupSection ? (
    <ExpandableSection
      toggleContent={
        <WithTooltip
          showTooltip={isReadOnly}
          content="This option cannot be edited from its original setting selection."
        >
          <span>Security groups</span>
        </WithTooltip>
      }
    >
      <Alert
        variant="info"
        isInline
        title="You cannot add or edit security groups to the machine pool nodes after they are created."
        actionLinks={
          <>
            <AlertActionLink component="a" href={links.ROSA_SECURITY_GROUPS} target="_blank">
              View more information
            </AlertActionLink>
            <AlertActionLink component="a" href={links.AWS_CONSOLE_SECURITY_GROUPS} target="_blank">
              AWS security groups console
            </AlertActionLink>
          </>
        }
      />
      <EditSecurityGroupsField cluster={cluster} isReadOnly={isReadOnly} />
    </ExpandableSection>
  ) : null;
};

export default EditSecurityGroupsSection;
