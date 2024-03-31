import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Flex, FlexItem, FormGroup, FormSelectProps } from '@patternfly/react-core';
import { SelectOptionObject as SelectOptionObjectDeprecated } from '@patternfly/react-core/deprecated';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { isSubnetMatchingPrivacy } from '~/common/vpcHelpers';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';
import FuzzySelect, { FuzzyDataType, FuzzyEntryType } from '~/components/common/FuzzySelect';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { FieldInputProps, FieldMetaProps } from 'formik';

const TRUNCATE_THRESHOLD = 40;

export interface SubnetSelectFieldProps {
  name: string;
  label: string;
  input:
    | (Pick<WrappedFieldInputProps, 'value' | 'name'> & {
        onChange: (subnetId: string | undefined) => void;
      })
    | FieldInputProps<FormSelectProps>;
  meta: Pick<WrappedFieldMetaProps, 'error' | 'touched'> | FieldMetaProps<FormSelectProps>;
  isRequired?: boolean;
  className?: string;
  privacy?: 'public' | 'private';
  selectedVPC: CloudVPC;
  withAutoSelect?: boolean;
  allowedAZs?: string[];
}

export const SubnetSelectField = ({
  name,
  label,
  input,
  meta,
  isRequired,
  className,
  privacy,
  withAutoSelect = true,
  selectedVPC,
  allowedAZs,
}: SubnetSelectFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedSubnetId = input.value as string;
  const inputError = meta.touched && (meta.error || (isRequired && !selectedSubnetId));

  const { subnetsByAZ, subnetList, hasOptions } = useMemo<{
    subnetsByAZ: FuzzyDataType;
    subnetList: Subnetwork[];
    hasOptions: boolean;
  }>(() => {
    const subnetList: Subnetwork[] = [];
    const subnetsByAZ: FuzzyDataType = {};

    selectedVPC.aws_subnets?.forEach((subnet) => {
      const subnetAZ = subnet.availability_zone || '';
      if (
        isSubnetMatchingPrivacy(subnet, privacy) &&
        (allowedAZs === undefined || allowedAZs.includes(subnetAZ))
      ) {
        const subnetId = subnet.subnet_id as string;
        const entry: FuzzyEntryType = {
          groupId: subnetAZ,
          entryId: subnetId,
          label: subnet.name || subnetId,
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
    return { subnetsByAZ, subnetList, hasOptions };
  }, [selectedVPC, allowedAZs, privacy]);

  useEffect(() => {
    const isValidCurrentSelection = subnetList.some(
      (subnet) => subnet.subnet_id === selectedSubnetId,
    );

    let newSelectedSubnetId = null;
    if (withAutoSelect) {
      // When "autoSelect" is enabled, we will set the first subnet as the selected one
      if (!isValidCurrentSelection && hasOptions) {
        newSelectedSubnetId = subnetList[0].subnet_id;
      }
    } else if (!isValidCurrentSelection) {
      // When "autoSelect" is disabled, we only need to update the selection when the current one is now invalid.
      // For example, because "selectedVPC" has changed
      newSelectedSubnetId = '';
    }

    if (newSelectedSubnetId !== null && newSelectedSubnetId !== selectedSubnetId) {
      input.onChange(newSelectedSubnetId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withAutoSelect, hasOptions, subnetList, selectedSubnetId]);

  const onSelect = useCallback(
    (_: MouseEvent | ChangeEvent, selectedSubnetId: string | SelectOptionObjectDeprecated) => {
      input.onChange(selectedSubnetId as string);
      setIsExpanded(false);
    },
    [input],
  );

  let placeholderText = `Select ${privacy} subnet`;
  if (selectedVPC?.id && !hasOptions && (allowedAZs === undefined || allowedAZs.length > 0)) {
    // This message will not appear when we are filtering by AZ, but it has not been selected yet
    placeholderText = `No ${privacy} subnets found.`;
  }

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
            selectedEntryId={selectedSubnetId}
            selectionData={subnetsByAZ}
            isDisabled={!selectedVPC?.id || !hasOptions}
            placeholderText={placeholderText}
            truncation={TRUNCATE_THRESHOLD}
            inlineFilterPlaceholderText="Filter by subnet ID / name"
            validated={inputError ? 'error' : undefined}
            isPopover
          />
        </FlexItem>
      </Flex>

      <FormGroupHelperText touched={meta.touched} error={inputError} />
    </FormGroup>
  );
};
