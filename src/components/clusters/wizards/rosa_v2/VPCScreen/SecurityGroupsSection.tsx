import React, { useState } from 'react';
import { ExpandableSection } from '@patternfly/react-core';
import { Field } from 'formik';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { SupportedFeature } from '~/common/featureCompatibility';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { validateSecurityGroups } from '~/common/validators';
import { SECURITY_GROUPS_FEATURE_DAY1 } from '~/redux/constants/featureConstants';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '../constants';

type SecurityGroupFieldProps = {
  selectedVPC: CloudVPC;
  label?: string;
  input: { onChange: (selectedGroupIds: string[]) => void; value: string[] };
};

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

const SecurityGroupsSection = ({
  openshiftVersion,
  selectedVPC,
}: {
  openshiftVersion: string;
  selectedVPC: CloudVPC;
}) => {
  const {
    setFieldValue,
    getFieldProps,
    getFieldMeta,
    values: { [FieldId.SecurityGroups]: securityGroups },
  } = useFormState();
  const applyAllFieldName = `${FieldId.SecurityGroups}.applyControlPlaneToAll`;
  const controlPlaneFieldName = `${FieldId.SecurityGroups}.controlPlane`;
  const infraFieldName = `${FieldId.SecurityGroups}.infra`;
  const workerFieldName = `${FieldId.SecurityGroups}.worker`;

  const hasFeatureGate = useFeatureGate(SECURITY_GROUPS_FEATURE_DAY1);
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
            name={applyAllFieldName}
            label="Apply the same security groups to all node types (control plane, infrastructure, worker)"
            input={{
              ...getFieldProps(applyAllFieldName),
              onChange: (_: React.FormEvent<HTMLInputElement>, value: boolean) =>
                setFieldValue(applyAllFieldName, value),
            }}
            meta={getFieldMeta(applyAllFieldName)}
          />

          <Field
            component={SecurityGroupField}
            name={controlPlaneFieldName}
            label={securityGroups.applyControlPlaneToAll ? '' : 'Control plane nodes'}
            selectedVPC={selectedVPC}
            validate={validateSecurityGroups}
            input={{
              ...getFieldProps(controlPlaneFieldName),
              onChange: (value: string[]) => setFieldValue(controlPlaneFieldName, value),
            }}
            meta={getFieldMeta(controlPlaneFieldName)}
          />
          {!securityGroups.applyControlPlaneToAll && (
            <>
              <Field
                component={SecurityGroupField}
                name={infraFieldName}
                label="Infrastructure nodes"
                selectedVPC={selectedVPC}
                validate={validateSecurityGroups}
                input={{
                  ...getFieldProps(infraFieldName),
                  onChange: (value: string[]) => setFieldValue(infraFieldName, value),
                }}
                meta={getFieldMeta(infraFieldName)}
              />
              <Field
                component={SecurityGroupField}
                name={workerFieldName}
                label="Worker nodes"
                selectedVPC={selectedVPC}
                validate={validateSecurityGroups}
                input={{
                  ...getFieldProps(workerFieldName),
                  onChange: (value: string[]) => setFieldValue(workerFieldName, value),
                }}
                meta={getFieldMeta(workerFieldName)}
              />
            </>
          )}
        </>
      )}
    </ExpandableSection>
  );
};

export default SecurityGroupsSection;
