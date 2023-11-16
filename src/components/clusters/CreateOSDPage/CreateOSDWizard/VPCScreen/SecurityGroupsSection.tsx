import React from 'react';
import { ExpandableSection } from '@patternfly/react-core';
import { Field, formValueSelector, change } from 'redux-form';

import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { useFeatureGate } from '~/hooks/useFeatureGate';
import { SupportedFeature } from '~/common/featureCompatibility';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { SECURITY_GROUPS_FEATURE } from '~/redux/constants/featureConstants';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import { useGlobalState } from '~/redux/hooks';

type SecurityGroupFieldProps = {
  selectedVPC: CloudVPC;
  label?: string;
  meta: { error: string; touched: boolean };
  input: { onChange: (selectedGroupIds: string[]) => void; value: string[] };
};

const CREATE_FORM = 'CreateCluster';
const fieldId = 'securityGroups';

const valueSelector = formValueSelector(CREATE_FORM);

const SecurityGroupField = ({
  input: { onChange, value: selectedGroupIds },
  label,
  meta,
  selectedVPC,
}: SecurityGroupFieldProps) => (
  <EditSecurityGroups
    label={label}
    clusterVpc={selectedVPC}
    selectedGroupIds={selectedGroupIds}
    validationError={meta.touched ? meta.error : undefined}
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
  const applyControlPlaneToAll = useGlobalState((state) => {
    const sg = valueSelector(state, fieldId);
    return sg?.applyControlPlaneToAll;
  });

  React.useEffect(() => {
    change(CREATE_FORM, fieldId, {
      applyControlPlaneToAll: false,
      controlPlane: [],
      infra: [],
      worker: [],
    });
  }, [selectedVPC.id]);

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
    <ExpandableSection toggleText="Additional security groups">
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
            label={applyControlPlaneToAll ? '' : 'Control plane nodes'}
            selectedVPC={selectedVPC}
          />
          {!applyControlPlaneToAll && (
            <>
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.infra`}
                label="Infrastructure nodes"
                selectedVPC={selectedVPC}
              />
              <Field
                component={SecurityGroupField}
                name={`${fieldId}.worker`}
                label="Worker nodes"
                selectedVPC={selectedVPC}
              />
            </>
          )}
        </>
      )}
    </ExpandableSection>
  );
};

export default SecurityGroupsSection;
