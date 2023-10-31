import React from 'react';
import { ExpandableSection } from '@patternfly/react-core';

import { SECURITY_GROUPS_FEATURE } from '~/redux/constants/featureConstants';

import { Cluster } from '~/types/clusters_mgmt.v1';
import { isCompatibleFeature, SupportedFeatures } from '~/common/featureCompatibility';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import EditSecurityGroups from './EditSecurityGroups';

export interface EditSecurityGroupsSectionProps {
  cluster: Cluster;
  isEdit: boolean;
}

const EditSecurityGroupsSection = ({ cluster, isEdit }: EditSecurityGroupsSectionProps) => {
  const hasFeatureGate = useFeatureGate(SECURITY_GROUPS_FEATURE);
  const showSecurityGroupSection =
    hasFeatureGate &&
    isCompatibleFeature(SupportedFeatures.SECURITY_GROUPS, cluster, { day2: true });

  return showSecurityGroupSection ? (
    <ExpandableSection toggleText="Security groups">
      <EditSecurityGroups cluster={cluster} isEdit={isEdit} />
    </ExpandableSection>
  ) : null;
};

export default EditSecurityGroupsSection;
