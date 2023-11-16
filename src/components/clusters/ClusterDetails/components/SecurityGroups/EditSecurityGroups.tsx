import React from 'react';
import {
  FormGroup,
  GridItem,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core';

import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { securityGroupsSort } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';

import SecurityGroupsViewList from './SecurityGroupsViewList';

export interface EditSecurityGroupsProps {
  label?: string;
  validationError?: string;
  selectedGroupIds: string[];
  clusterVpc: CloudVPC;
  isReadOnly: boolean;
  onChange: (securityGroupIds: string[]) => void;
}

const EditSecurityGroups = ({
  label = 'Security groups',
  clusterVpc,
  selectedGroupIds,
  validationError,
  onChange,
  isReadOnly,
}: EditSecurityGroupsProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const vpcSecurityGroups = clusterVpc.aws_security_groups || [];
  const selectedOptions = vpcSecurityGroups.filter((sg) => selectedGroupIds.includes(sg.id || ''));
  selectedOptions.sort(securityGroupsSort);

  if (isReadOnly) {
    // Shows read-only chips, or an empty message if no SGs are selected
    return (
      <SecurityGroupsViewList
        securityGroups={selectedOptions}
        emptyMessage="This machine pool does not have additional security groups."
        isReadOnly
      />
    );
  }

  const onDeleteGroup = (deleteGroupId: string) => {
    const newGroupIdsValue = selectedGroupIds.filter((sgId) => sgId !== deleteGroupId);
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
      const newGroupIds = selectedGroupIds.concat(selectedGroupId);
      const selectedGroups = vpcSecurityGroups.filter((sg) => newGroupIds.includes(sg.id || ''));
      selectedGroups.sort(securityGroupsSort);

      onChange(selectedGroups.map((group) => group.id || ''));
    }
  };

  return (
    <GridItem>
      <FormGroup
        fieldId="securityGroupIds"
        label={label}
        className="pf-u-mt-md"
        validated={validationError ? 'error' : 'default'}
        helperTextInvalid={validationError}
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
