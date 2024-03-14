import React from 'react';
import { ExpandableSection } from '@patternfly/react-core';

import { SECURITY_GROUPS_FEATURE } from '~/redux/constants/featureConstants';

import { Cluster } from '~/types/clusters_mgmt.v1';
import WithTooltip from '~/components/common/WithTooltip';
import { isCompatibleFeature, SupportedFeature } from '~/common/featureCompatibility';
import { useFeatureGate } from '~/hooks/useFeatureGate';
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
      <EditSecurityGroupsField cluster={cluster} isReadOnly={isReadOnly} />
    </ExpandableSection>
  ) : null;
};

export default EditSecurityGroupsSection;
