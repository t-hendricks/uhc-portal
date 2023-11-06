import React from 'react';
import {
  Alert,
  FormGroup,
  GridItem,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Spinner,
} from '@patternfly/react-core';
import { useField } from 'formik';

import { Cluster } from '~/types/clusters_mgmt.v1';
import { useAWSVPCFromCluster } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/NetworkScreen/useAWSVPCFromCluster';
import { securityGroupsSort } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';
import SecurityGroupsViewList from '~/components/clusters/ClusterDetails/components/MachinePools/components/SecurityGroups/SecurityGroupsViewList';
import { EditMachinePoolValues } from '../hooks/useMachinePoolFormik';
import useFormikOnChange from '../hooks/useFormikOnChange';

const fieldId = 'securityGroupIds';

export interface EditSecurityGroupsProps {
  cluster: Cluster;
  isEdit: boolean;
}

const EditSecurityGroups = ({ cluster, isEdit }: EditSecurityGroupsProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [field, meta] = useField<EditMachinePoolValues['securityGroupIds']>(fieldId);
  const onChange = useFormikOnChange(fieldId);

  const { clusterVpc, isLoading } = useAWSVPCFromCluster(cluster);

  if (isLoading) {
    return <Spinner>Loading security groups</Spinner>;
  }

  if (!clusterVpc) {
    return (
      <Alert type="warning" title="Could not load the cluster's VPC" isInline>
        Please try refreshing the machine pool details
      </Alert>
    );
  }

  const vpcSecurityGroups = clusterVpc.aws_security_groups || [];
  if (vpcSecurityGroups.length === 0) {
    return (
      <Alert
        variant="info"
        isInline
        title="There are no security groups for this Virtual Private Cloud"
      >
        Security groups can be defined inside the AWS console.
      </Alert>
    );
  }

  const selectedGroupIds = field.value || [];
  const selectedOptions = vpcSecurityGroups.filter((sg) => selectedGroupIds.includes(sg.id || ''));
  selectedOptions.sort(securityGroupsSort);

  if (isEdit) {
    return (
      <SecurityGroupsViewList
        securityGroups={selectedOptions}
        emptyMessage="This machine pool does not have additional security groups."
        isReadOnly
      />
    );
  }

  const onDeleteGroup = (deleteGroupId: string) => {
    const newGroupIdsValue = field.value.filter((sgId) => sgId !== deleteGroupId);
    onChange(newGroupIdsValue);
  };

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
  ) => {
    const selectedGroupId = value as string;
    const wasPreviouslySelected = selectedGroupIds.includes(selectedGroupId);
    if (wasPreviouslySelected) {
      // The SG has been unselected
      onDeleteGroup(selectedGroupId);
    } else {
      // The SG has been selected
      const newGroupIds = field.value.concat(selectedGroupId);
      const x = vpcSecurityGroups.filter((sg) => newGroupIds.includes(sg.id || ''));
      x.sort(securityGroupsSort);

      const sortedGroupIds = x.map((group) => group.id);
      onChange(sortedGroupIds);
    }
  };

  return (
    <GridItem>
      <FormGroup
        fieldId="securityGroupIds"
        label="Security groups"
        validated={meta.touched && meta.error ? 'error' : 'default'}
      >
        <>
          <SecurityGroupsViewList
            securityGroups={selectedOptions}
            isReadOnly={false}
            onClickItem={onDeleteGroup}
          />
          <Select
            variant={SelectVariant.checkbox}
            selections={selectedGroupIds}
            isOpen={isOpen}
            placeholderText="Select security groups"
            aria-labelledby="Select AWS security groups"
            onToggle={(isExpanded) => setIsOpen(isExpanded)}
            onSelect={onSelect}
            maxHeight={300}
            menuAppendTo={document.getElementById('edit-mp-modal') || undefined}
          >
            {vpcSecurityGroups.map((sg) => {
              const sgId = sg.id || '';
              return (
                <SelectOption key={sgId} value={sgId} description={sgId}>
                  {sg.name || '--'}
                </SelectOption>
              );
            })}
          </Select>
        </>
      </FormGroup>
    </GridItem>
  );
};

export default EditSecurityGroups;
