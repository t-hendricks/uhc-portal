import React from 'react';

import { FormGroup, GridItem } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectOptionObject as SelectOptionObjectDeprecated,
} from '@patternfly/react-core/deprecated';

import { truncateTextWithEllipsis } from '~/common/helpers';
import { validateSecurityGroups } from '~/common/validators';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { securityGroupsSort } from '~/redux/reducers/ccsInquiriesReducer';
import { CloudVPC } from '~/types/clusters_mgmt.v1';

import SecurityGroupsViewList from './SecurityGroupsViewList';

export interface EditSecurityGroupsProps {
  label?: string;
  selectedGroupIds: string[];
  selectedVPC: CloudVPC;
  isReadOnly: boolean;
  isHypershift: boolean;
  onChange: (securityGroupIds: string[]) => void;
}

const getDisplayName = (securityGroupName: string) => {
  if (securityGroupName) {
    const maxVisibleLength = 50;
    const displayName = truncateTextWithEllipsis(securityGroupName, maxVisibleLength);
    return { displayName, isCut: securityGroupName.length > maxVisibleLength };
  }
  return { displayName: '--', isCut: false };
};

const EditSecurityGroups = ({
  label = 'Security groups',
  selectedVPC,
  selectedGroupIds,
  onChange,
  isReadOnly,
  isHypershift,
}: EditSecurityGroupsProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const vpcSecurityGroups = selectedVPC.aws_security_groups || [];
  const selectedGroupsBelongToAnotherVpc =
    !isReadOnly && selectedGroupIds.some((sgId) => vpcSecurityGroups.every((sg) => sg.id !== sgId));
  const selectedOptions = vpcSecurityGroups.filter((sg) => selectedGroupIds.includes(sg.id || ''));
  selectedOptions.sort(securityGroupsSort);

  React.useEffect(() => {
    // When the VPC changes while in edit mode,
    // the previously selected security groups become invalid and should be cleared
    if (selectedGroupsBelongToAnotherVpc) {
      onChange([]);
    }
  }, [onChange, selectedGroupsBelongToAnotherVpc]);

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
    value: string | SelectOptionObjectDeprecated,
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

  const validationError = validateSecurityGroups(selectedGroupIds, isHypershift);

  return (
    <GridItem>
      <FormGroup fieldId="securityGroupIds" label={label} className="pf-v5-u-mt-md">
        <>
          <SecurityGroupsViewList
            securityGroups={selectedOptions}
            isReadOnly={false}
            onClickItem={onDeleteGroup}
          />
          <SelectDeprecated
            variant="checkbox"
            selections={selectedGroupIds}
            isOpen={isOpen}
            placeholderText="Select security groups"
            aria-labelledby="Select AWS security groups"
            onToggle={(_event, isExpanded) => setIsOpen(isExpanded)}
            onSelect={onSelect}
            maxHeight={300}
            menuAppendTo={document.getElementById('edit-mp-modal') || undefined}
          >
            {vpcSecurityGroups.map(({ id = '', name = '' }) => {
              const { displayName, isCut } = getDisplayName(name);
              return (
                <SelectOptionDeprecated
                  key={id}
                  value={id}
                  description={id}
                  title={isCut ? name : ''}
                >
                  {displayName}
                </SelectOptionDeprecated>
              );
            })}
          </SelectDeprecated>
        </>
      </FormGroup>
      <FormGroupHelperText touched error={validationError} />
    </GridItem>
  );
};

export default EditSecurityGroups;
