import React, { useState } from 'react';
import { ExpandableSection } from '@patternfly/react-core';
import { Field } from 'formik';

import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { validateSecurityGroups } from '~/common/validators';
import { SupportedFeature } from '~/common/featureCompatibility';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { SECURITY_GROUPS_FEATURE_DAY1 } from '~/redux/constants/featureConstants';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import { CheckboxField } from '~/components/clusters/wizards/form';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';

type SecurityGroupFieldProps = {
  selectedVPC: CloudVPC;
  label?: string;
  input: { onChange: (selectedGroupIds: string[]) => void; value: string[] };
};

const fieldId = 'securityGroups';

const SecurityGroupField = ({
  input: { onChange, value: selectedGroupIds },
  label,
  selectedVPC,
}: SecurityGroupFieldProps) => (
  <EditSecurityGroups
    label={label}
    selectedVPC={selectedVPC}
    selectedGroupIds={selectedGroupIds}
    isReadOnly={false}
    onChange={onChange}
  />
);

const SecurityGroupsSection = () => {
  const hasFeatureGate = useFeatureGate(SECURITY_GROUPS_FEATURE_DAY1);
  const {
    values: {
      [FieldId.SelectedVpc]: selectedVPC,
      [FieldId.ClusterVersion]: version,
      [FieldId.SecurityGroups]: securityGroups,
    },
    getFieldProps,
    setFieldValue,
  } = useFormState();

  const { applyControlPlaneToAll } = securityGroups;
  const selectedGroups = applyControlPlaneToAll
    ? securityGroups.controlPlane
    : securityGroups.controlPlane.concat(securityGroups.infra).concat(securityGroups.worker);
  const [isExpanded, setIsExpanded] = useState<boolean>(selectedGroups.length > 0);

  if (!hasFeatureGate || !selectedVPC.id) {
    return null;
  }

  const setValue = (fieldName: string) => (value: string) => setFieldValue(fieldName, value);
  const onExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    version?.raw_id,
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
            component={CheckboxField}
            name={`${fieldId}.applyControlPlaneToAll`}
            label="Apply the same security groups to all node types (control plane, infrastructure, worker)"
            input={{
              ...getFieldProps(`${fieldId}.applyControlPlaneToAll`),
              onChange: setValue(`${fieldId}.applyControlPlaneToAll`),
            }}
          />
          <Field
            component={SecurityGroupField}
            name={`${fieldId}.controlPlane`}
            label={applyControlPlaneToAll ? '' : 'Control plane nodes'}
            selectedVPC={selectedVPC}
            validate={validateSecurityGroups}
            input={{
              ...getFieldProps(`${fieldId}.controlPlane`),
              onChange: setValue(`${fieldId}.controlPlane`),
            }}
          />
          {!applyControlPlaneToAll && (
            <>
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.infra`}
                label="Infrastructure nodes"
                selectedVPC={selectedVPC}
                validate={validateSecurityGroups}
                input={{
                  ...getFieldProps(`${fieldId}.infra`),
                  onChange: setValue(`${fieldId}.infra`),
                }}
              />
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.worker`}
                label="Worker nodes"
                selectedVPC={selectedVPC}
                validate={validateSecurityGroups}
                input={{
                  ...getFieldProps(`${fieldId}.worker`),
                  onChange: setValue(`${fieldId}.worker`),
                }}
              />
            </>
          )}
        </>
      )}
    </ExpandableSection>
  );
};

export default SecurityGroupsSection;
