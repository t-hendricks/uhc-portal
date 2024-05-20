import React, { useState } from 'react';
import { Field, formValueSelector } from 'redux-form';

import { Alert, AlertActionLink, ExpandableSection } from '@patternfly/react-core';

import { SupportedFeature } from '~/common/featureCompatibility';
import links from '~/common/installLinks.mjs';
import { validateSecurityGroups } from '~/common/validators';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { SECURITY_GROUPS_FEATURE_DAY1 } from '~/redux/constants/featureConstants';
import { useGlobalState } from '~/redux/hooks';
import { CloudVPC } from '~/types/clusters_mgmt.v1';

type SecurityGroupFieldProps = {
  selectedVPC: CloudVPC;
  label?: string;
  input: { onChange: (selectedGroupIds: string[]) => void; value: string[] };
  isHypershift: boolean;
};

const CREATE_FORM = 'CreateCluster';
const fieldId = 'securityGroups';

const valueSelector = formValueSelector(CREATE_FORM);

const SecurityGroupField = ({
  input: { onChange, value: selectedGroupIds },
  label,
  selectedVPC,
  isHypershift,
}: SecurityGroupFieldProps) => (
  <EditSecurityGroups
    label={label}
    selectedVPC={selectedVPC}
    selectedGroupIds={selectedGroupIds}
    isReadOnly={false}
    onChange={onChange}
    isHypershift={isHypershift}
  />
);

const SecurityGroupsSection = ({
  openshiftVersion,
  selectedVPC,
  isHypershiftSelected,
}: {
  openshiftVersion: string;
  selectedVPC: CloudVPC;
  isHypershiftSelected: boolean;
}) => {
  const hasFeatureGate = useFeatureGate(SECURITY_GROUPS_FEATURE_DAY1);
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
    { day1: true, isHypershift: isHypershiftSelected },
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
          <Alert
            variant="info"
            isInline
            title="You cannot add or edit security groups associated with the control plane nodes, infrastructure nodes, or machine pools that were created by default during cluster creation."
            actionLinks={
              <>
                <AlertActionLink component="a" href={links.ROSA_SECURITY_GROUPS} target="_blank">
                  View more information
                </AlertActionLink>
                <AlertActionLink
                  component="a"
                  href={links.AWS_CONSOLE_SECURITY_GROUPS}
                  target="_blank"
                >
                  AWS security groups console
                </AlertActionLink>
              </>
            }
          />
          <br />
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
            validate={(securityGroupIds: string[]) =>
              validateSecurityGroups(securityGroupIds, isHypershiftSelected)
            }
            isHypershift={isHypershiftSelected}
          />
          {!securityGroups.applyControlPlaneToAll && (
            <>
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.infra`}
                label="Infrastructure nodes"
                selectedVPC={selectedVPC}
                validate={(securityGroupIds: string[]) =>
                  validateSecurityGroups(securityGroupIds, isHypershiftSelected)
                }
                isHypershift={isHypershiftSelected}
              />
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.worker`}
                label="Worker nodes"
                selectedVPC={selectedVPC}
                validate={(securityGroupIds: string[]) =>
                  validateSecurityGroups(securityGroupIds, isHypershiftSelected)
                }
                isHypershift={isHypershiftSelected}
              />
            </>
          )}
        </>
      )}
    </ExpandableSection>
  );
};

export default SecurityGroupsSection;
