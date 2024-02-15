import React from 'react';
import { Alert, AlertVariant, Spinner } from '@patternfly/react-core';
import { useField } from 'formik';

import { Cluster } from '~/types/clusters_mgmt.v1';
import { getIncompatibleVersionReason } from '~/common/versionCompatibility';
import { SupportedFeature } from '~/common/featureCompatibility';
import { useAWSVPCFromCluster } from '~/components/clusters/common/useAWSVPCFromCluster';
import EditSecurityGroups from '~/components/clusters/ClusterDetails/components/SecurityGroups/EditSecurityGroups';
import SecurityGroupsEmptyAlert from '~/components/clusters/ClusterDetails/components/SecurityGroups/SecurityGroupsEmptyAlert';
import useFormikOnChange from '~/hooks/useFormikOnChange';

import { EditMachinePoolValues } from '../hooks/useMachinePoolFormik';

const fieldId = 'securityGroupIds';

export interface EditSecurityGroupsFieldProps {
  cluster: Cluster;
  isReadOnly: boolean;
}

const EditSecurityGroupsField = ({ cluster, isReadOnly }: EditSecurityGroupsFieldProps) => {
  const [field] = useField<EditMachinePoolValues['securityGroupIds']>(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const { clusterVpc, isLoading } = useAWSVPCFromCluster(cluster);

  if (isLoading) {
    return <Spinner>Loading security groups</Spinner>;
  }

  if (!clusterVpc) {
    return (
      <Alert variant={AlertVariant.warning} title="Could not load the cluster's VPC" isInline>
        Please try refreshing the machine pool details
      </Alert>
    );
  }
  if ((clusterVpc.aws_security_groups || []).length === 0) {
    return <SecurityGroupsEmptyAlert />;
  }

  const incompatibleReason = getIncompatibleVersionReason(
    SupportedFeature.SECURITY_GROUPS,
    cluster.openshift_version,
    { day2: true },
  );
  if (incompatibleReason) {
    return <>{incompatibleReason}</>;
  }
  return (
    <EditSecurityGroups
      selectedVPC={clusterVpc}
      isReadOnly={isReadOnly}
      selectedGroupIds={field.value}
      onChange={onChange}
    />
  );
};

export default EditSecurityGroupsField;
