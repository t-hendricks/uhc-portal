import React, { ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';
import { Alert, Flex, FormGroup, SelectOptionObject, Spinner } from '@patternfly/react-core';

import { useAWSVPCsFromCluster } from '~/components/clusters/ClusterDetails/components/MachinePools/components/AddMachinePoolModal/useAWSVPCsFromCluster';
import {
  isSubnetMatchingPrivacy,
  useAWSVPCInquiry,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/useVPCInquiry';
import ErrorBox from '~/components/common/ErrorBox';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';
import FuzzySelect, { FuzzyDataType, FuzzyEntryType } from '~/components/common/FuzzySelect';

const TRUNCATE_THRESHOLD = 40;

export interface SubnetSelectFieldProps {
  name: string;
  label: string;
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  privacy?: 'public' | 'private';
  selectedVPC?: string;
  isNewCluster: boolean;
  withAutoSelect: boolean;
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
  isNewCluster,
  allowedAZ,
}: SubnetSelectFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubnet, setSelectedSubnet] = useState(input.value);
  const vpcs = isNewCluster ? useAWSVPCInquiry() : useAWSVPCsFromCluster();

  const { pending: isVpcsLoading, fulfilled: isVpcsFulfilled, error: vpcsError } = vpcs;

  // if subnets have the more descriptive name, use that
  const { selectionData, vpcsItems, subnetList, hasNoOptions, hasSubnetNames } = useMemo<{
    selectionData: FuzzyDataType;
    vpcsItems: CloudVPC[];
    subnetList: Subnetwork[];
    hasNoOptions: boolean;
    hasSubnetNames: boolean;
  }>(() => {
    let vpcsItems: CloudVPC[] = vpcs.data?.items || [];
    if (selectedVPC) {
      vpcsItems = vpcsItems.filter((item: CloudVPC) => item.id === selectedVPC);
    }
    const subnetList: Subnetwork[] = [];
    const selectionData = vpcsItems?.reduce(
      (acc: Record<string, FuzzyEntryType[]>, vpc: CloudVPC) => {
        const { aws_subnets: subnets } = vpc;
        if (subnets && subnets.length > 0) {
          subnets.forEach((subnet) => {
            if (subnet.availability_zone && isSubnetMatchingPrivacy(subnet, privacy)) {
              if (allowedAZ === undefined || allowedAZ.includes(subnet.availability_zone)) {
                const entry: FuzzyEntryType = {
                  key: subnet.name || subnet.subnet_id || 'unknown',
                  groupKey: subnet.availability_zone,
                  value: subnet,
                };
                if (acc[subnet.availability_zone]) {
                  acc[subnet.availability_zone].push(entry);
                } else {
                  acc[subnet.availability_zone] = [entry];
                }
                subnetList.push(subnet);
              }
            }
          });
        }

        return acc;
      },
      {},
    );
    const hasNoOptions = subnetList?.length === 0;
    const hasSubnetNames = !hasNoOptions && subnetList.every((subnet) => !!subnet.name);
    return { selectionData, vpcsItems, subnetList, hasNoOptions, hasSubnetNames };
  }, [vpcs.data?.items, selectedVPC]);

  useEffect(() => {
    const isValidCurrentSelection = subnetList.some(
      (subnet) => subnet.subnet_id === selectedSubnet?.subnet_id,
    );

    let newSelection;
    if (withAutoSelect) {
      // When "autoSelect" is enabled, we will set the first subnet as the selected one
      if (!isValidCurrentSelection && isVpcsFulfilled) {
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
  }, [withAutoSelect, isVpcsFulfilled, subnetList, selectedSubnet]);

  const onSelect = useCallback(
    (_: MouseEvent | ChangeEvent, selectedSubnet: string | SelectOptionObject) => {
      input.onChange(selectedSubnet);
      setSelectedSubnet(selectedSubnet);
      setIsExpanded(false);
    },
    [setSelectedSubnet, setIsExpanded],
  );

  return (
    <FormGroup
      fieldId={name}
      label={label}
      id={input.name}
      validated={isInputTouched && inputError ? 'error' : undefined}
      helperTextInvalid={isInputTouched && (vpcsError || inputError)}
      isRequired={isRequired}
      className={className}
    >
      {vpcsError && !isVpcsLoading && (
        <ErrorBox message="Failed to fetch subnets." response={vpcs} />
      )}

      {!vpcsError && !isVpcsLoading && vpcsItems?.length === 0 && (
        <Alert
          variant="danger"
          isInline
          isPlain
          title={`A VPC with a ${privacy} subnet must be associated with the selected AWS account ID.`}
          className="pf-u-mb-sm"
        />
      )}

      {isVpcsLoading ? (
        <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsSm' }}>
          <Spinner size="md" />
          <span>Loading...</span>
        </Flex>
      ) : (
        <FuzzySelect
          label={label}
          aria-label={label}
          isOpen={isExpanded}
          onToggle={(isExpanded) => setIsExpanded(isExpanded)}
          onSelect={onSelect}
          selected={selectedSubnet?.name}
          selectionData={selectionData}
          isDisabled={isDisabled || hasNoOptions}
          placeholderText={
            hasNoOptions ? 'No data found.' : `${hasSubnetNames ? 'Subnet name' : 'Subnet ID'}`
          }
          truncation={TRUNCATE_THRESHOLD}
          inlineFilterPlaceholderText={`Filter by subnet ${hasSubnetNames ? 'name' : 'ID'}`}
          validated={inputError ? 'error' : undefined}
        />
      )}
    </FormGroup>
  );
};
