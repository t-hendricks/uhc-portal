import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, FlexItem, FormGroup } from '@patternfly/react-core';
import { SelectOptionObject as SelectOptionObjectDeprecated } from '@patternfly/react-core/deprecated';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';
import { isSubnetMatchingPrivacy } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/useVPCInquiry';
import FuzzySelect, { FuzzyDataType, FuzzyEntryType } from '~/components/common/FuzzySelect';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';

const TRUNCATE_THRESHOLD = 40;

export interface SubnetSelectFieldProps {
  name: string;
  label: string;
  input: Pick<WrappedFieldInputProps, 'value' | 'onChange' | 'name'>;
  meta: Pick<WrappedFieldMetaProps, 'error' | 'touched'>;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  privacy?: 'public' | 'private';
  selectedVPC: CloudVPC;
  withAutoSelect?: boolean;
  allowedAZ?: string[];
}

export const SubnetSelectField = ({
  name,
  label,
  input,
  meta: { error: inputError, touched: isInputTouched },
  isDisabled,
  isRequired,
  className,
  privacy,
  withAutoSelect = true,
  selectedVPC,
  allowedAZ,
}: SubnetSelectFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubnet, setSelectedSubnet] = useState(input.value);

  const placeholder = (hasOptions: boolean, hasSubnetNames: boolean) =>
    (!hasOptions && 'No data found.') ||
    (hasOptions && hasSubnetNames && 'Subnet name') ||
    (hasOptions && !hasSubnetNames && 'Subnet ID');

  // if subnets have the more descriptive name, use that
  const { subnetsByAZ, subnetList, hasOptions, hasSubnetNames } = useMemo<{
    subnetsByAZ: FuzzyDataType;
    subnetList: Subnetwork[];
    hasOptions: boolean;
    hasSubnetNames: boolean;
  }>(() => {
    const subnetList: Subnetwork[] = [];
    const subnetsByAZ: FuzzyDataType = {};

    selectedVPC.aws_subnets?.forEach((subnet) => {
      const subnetAZ = subnet.availability_zone || '';
      if (
        isSubnetMatchingPrivacy(subnet, privacy) &&
        (allowedAZ === undefined || allowedAZ.includes(subnetAZ))
      ) {
        const entry: FuzzyEntryType = {
          key: subnet.name || subnet.subnet_id || 'unknown',
          groupKey: subnetAZ,
          value: subnet,
        };
        if (subnetsByAZ[subnetAZ]) {
          subnetsByAZ[subnetAZ].push(entry);
        } else {
          subnetsByAZ[subnetAZ] = [entry];
        }
        subnetList.push(subnet);
      }
    });
    const hasOptions = subnetList.length > 0;
    const hasSubnetNames = hasOptions && subnetList.every((subnet) => !!subnet.name);
    return { subnetsByAZ, subnetList, hasOptions, hasSubnetNames };
  }, [selectedVPC, allowedAZ, privacy]);

  useEffect(() => {
    const isValidCurrentSelection = subnetList.some(
      (subnet) => subnet.subnet_id === selectedSubnet?.subnet_id,
    );

    let newSelection;
    if (withAutoSelect) {
      // When "autoSelect" is enabled, we will set the first subnet as the selected one
      if (!isValidCurrentSelection && hasOptions) {
        [newSelection] = subnetList;
      }
    } else if (!isValidCurrentSelection) {
      // When "autoSelect" is disabled, we only need to update the selection when the current one is now invalid.
      // For example, because "selectedVPC" has changed
      newSelection = { subnet_id: '', availability_zone: '' };
    }

    if (newSelection && newSelection.subnet_id !== selectedSubnet?.subnet_id) {
      input.onChange(newSelection);
      setSelectedSubnet(newSelection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withAutoSelect, hasOptions, subnetList, selectedSubnet]);

  const onSelect = useCallback(
    (_: MouseEvent | ChangeEvent, selectedSubnet: string | SelectOptionObjectDeprecated) => {
      input.onChange(selectedSubnet);
      setSelectedSubnet(selectedSubnet);
      setIsExpanded(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSelectedSubnet, setIsExpanded],
  );

  return (
    <FormGroup
      fieldId={name}
      label={label}
      id={input.name}
      isRequired={isRequired}
      className={className}
    >
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <FuzzySelect
            label={label}
            aria-label={label}
            isOpen={isExpanded}
            onToggle={(_, isExpanded) => setIsExpanded(isExpanded)}
            onSelect={onSelect}
            selected={selectedSubnet?.name || selectedSubnet?.subnet_id}
            selectionData={subnetsByAZ}
            isDisabled={isDisabled || !hasOptions}
            placeholderText={placeholder(hasOptions, hasSubnetNames)}
            truncation={TRUNCATE_THRESHOLD}
            inlineFilterPlaceholderText={`Filter by subnet ${hasSubnetNames ? 'name' : 'ID'}`}
            validated={inputError ? 'error' : undefined}
          />
        </FlexItem>
      </Flex>

      <FormGroupHelperText touched={isInputTouched} error={inputError} />
    </FormGroup>
  );
};
