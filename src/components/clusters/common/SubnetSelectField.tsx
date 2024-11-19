import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { Flex, FlexItem, FormGroup, FormSelectProps } from '@patternfly/react-core';

import { isSubnetMatchingPrivacy } from '~/common/vpcHelpers';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { FuzzySelect, FuzzySelectProps } from '~/components/common/FuzzySelect/FuzzySelect';
import { FuzzyDataType, FuzzyEntryType } from '~/components/common/FuzzySelect/types';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';

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

  const onSelect: NonNullable<FuzzySelectProps['onSelect']> = useCallback(
    (_event, selectedSubnetId) => {
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
      fieldId={name || input.name}
      label={label}
      isRequired={isRequired}
      className={className}
    >
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <FuzzySelect
            aria-label={label}
            isOpen={isExpanded}
            onOpenChange={(isExpanded) => setIsExpanded(isExpanded)}
            onSelect={onSelect}
            selectedEntryId={selectedSubnetId}
            selectionData={subnetsByAZ}
            isDisabled={!selectedVPC?.id || !hasOptions}
            placeholderText={placeholderText}
            truncation={TRUNCATE_THRESHOLD}
            inlineFilterPlaceholderText="Filter by subnet ID / name"
            validated={inputError ? 'danger' : undefined}
            isPopover
            toggleId={name || input.name}
          />
        </FlexItem>
      </Flex>

      <FormGroupHelperText touched={meta.touched} error={inputError} />
    </FormGroup>
  );
};
