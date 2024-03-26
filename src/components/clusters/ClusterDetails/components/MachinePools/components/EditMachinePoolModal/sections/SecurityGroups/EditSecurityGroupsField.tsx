import React from 'react';
import { Alert, AlertVariant, Spinner } from '@patternfly/react-core';
import { Field } from 'formik';

import { Cluster } from '~/types/clusters_mgmt.v1';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { SupportedFeature } from '~/common/featureCompatibility';
import { useAWSVPCFromCluster } from '~/components/clusters/common/useAWSVPCFromCluster';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import SecurityGroupsNoChangeAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsNoChangeAlert';
import { FieldId } from '~/components/clusters/wizards/common';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { validateSecurityGroups } from '~/common/validators';
import { isHypershiftCluster, isROSA } from '~/components/clusters/common/clusterStates';

export interface EditSecurityGroupsFieldProps {
  cluster: Cluster;
  isReadOnly: boolean;
}

const EditSecurityGroupsField = ({ cluster, isReadOnly }: EditSecurityGroupsFieldProps) => {
  const {
    values: { [FieldId.SecurityGroupIds]: selectedGroupIds },
    setFieldValue,
    setFieldTouched,
  } = useFormState();

  const { clusterVpc, isLoading, errorReason } = useAWSVPCFromCluster(cluster);

  if (isLoading) {
    return <Spinner>Loading security groups</Spinner>;
  }

  if (!clusterVpc) {
    return (
      <Alert variant={AlertVariant.warning} title="Could not load the cluster's VPC" isInline>
        {errorReason || 'Please try refreshing the machine pool details'}
      </Alert>
    );
  }
  if ((clusterVpc.aws_security_groups || []).length === 0) {
    return <SecurityGroupsEmptyAlert />;
  }

  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    cluster.openshift_version,
    { day2: true, isHypershift: isHypershiftCluster(cluster) },
  );
  return incompatibleReason ? (
    <Alert variant={AlertVariant.warning} title={incompatibleReason} isInline />
  ) : (
    <>
      <SecurityGroupsNoChangeAlert isRosa={isROSA(cluster)} />
      <Field
        component={EditSecurityGroups}
        name={FieldId.SecurityGroupIds}
        onChange={(values: string[]) => {
          setFieldValue(FieldId.SecurityGroupIds, values, true);
          setFieldTouched(FieldId.SecurityGroupIds, true, false);
        }}
        validate={validateSecurityGroups}
        selectedVPC={clusterVpc}
        isReadOnly={isReadOnly}
        selectedGroupIds={selectedGroupIds}
      />
    </>
  );
};

export default EditSecurityGroupsField;
