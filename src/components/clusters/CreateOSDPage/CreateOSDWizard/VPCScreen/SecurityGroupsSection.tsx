import React, { useState } from 'react';
import { ExpandableSection } from '@patternfly/react-core';
import { Field, formValueSelector } from 'redux-form';

import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { SupportedFeature } from '~/common/featureCompatibility';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { validateSecurityGroups } from '~/common/validators';
import { SECURITY_GROUPS_FEATURE } from '~/redux/constants/featureConstants';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import { useGlobalState } from '~/redux/hooks';

type SecurityGroupFieldProps = {
  selectedVPC: CloudVPC;
  label?: string;
  input: { onChange: (selectedGroupIds: string[]) => void; value: string[] };
};

const CREATE_FORM = 'CreateCluster';
const fieldId = 'securityGroups';

const valueSelector = formValueSelector(CREATE_FORM);

const SecurityGroupField = ({
  input: { onChange, value: selectedGroupIds },
  label,
  selectedVPC,
}: SecurityGroupFieldProps) => (
  <EditSecurityGroups
    label={label}
    clusterVpc={selectedVPC}
    selectedGroupIds={selectedGroupIds}
    isReadOnly={false}
    onChange={onChange}
  />
);

const SecurityGroupsSection = ({
  openshiftVersion,
  selectedVPC,
}: {
  openshiftVersion: string;
  selectedVPC: CloudVPC;
}) => {
  const hasFeatureGate = useFeatureGate(SECURITY_GROUPS_FEATURE);
  const securityGroups = useGlobalState((state) => valueSelector(state, fieldId));
  const selectedGroups = securityGroups.applyControlPlaneToAll
    ? securityGroups.controlPlane
    : securityGroups.controlPlane.concat(securityGroups.infra).concat(securityGroups.worker);
  const [isExpanded, setIsExpanded] = useState<boolean>(selectedGroups.length > 0);

  const onExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (!hasFeatureGate || !selectedVPC.id) {
    return null;
  }

  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    openshiftVersion,
    { day1: true },
  );

  const showEmptyAlert =
    !incompatibleReason && (selectedVPC.aws_security_groups || []).length === 0;

  return (
    <ExpandableSection
      toggleText="Additional security groups"
      isExpanded={isExpanded}
      onToggle={onExpandToggle}
    >
      {incompatibleReason && <div>{incompatibleReason}</div>}
      {showEmptyAlert && <SecurityGroupsEmptyAlert />}
      {!incompatibleReason && !showEmptyAlert && (
        <>
          <Field
            component={ReduxCheckbox}
            name={`${fieldId}.applyControlPlaneToAll`}
            label="Apply the same security groups to all node types (control plane, infrastructure, worker)"
          />

          <Field
            component={SecurityGroupField}
            name={`${fieldId}.controlPlane`}
            label={securityGroups.applyControlPlaneToAll ? '' : 'Control plane nodes'}
            selectedVPC={selectedVPC}
            validate={validateSecurityGroups}
          />
          {!securityGroups.applyControlPlaneToAll && (
            <>
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.infra`}
                label="Infrastructure nodes"
                selectedVPC={selectedVPC}
                validate={validateSecurityGroups}
              />
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.worker`}
                label="Worker nodes"
                selectedVPC={selectedVPC}
                validate={validateSecurityGroups}
              />
            </>
          )}
        </>
      )}
    </ExpandableSection>
  );
};

export default SecurityGroupsSection;
