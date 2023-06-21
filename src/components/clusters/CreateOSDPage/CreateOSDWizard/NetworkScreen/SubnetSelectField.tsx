import React from 'react';

import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';
import {
  Alert,
  Flex,
  FormGroup,
  Select,
  SelectGroup,
  SelectOption,
  SelectOptionObject,
  Spinner,
} from '@patternfly/react-core';

import { useAWSVPCsFromCluster } from '~/components/clusters/ClusterDetails/components/MachinePools/components/AddMachinePoolModal/useAWSVPCsFromCluster';
import {
  isSubnetMatchingPrivacy,
  useAWSVPCInquiry,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/useVPCInquiry';
import ErrorBox from '~/components/common/ErrorBox';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';

interface SubnetSelectFieldProps {
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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedSubnet, setSelectedSubnet] = React.useState(input.value);
  const vpcs = isNewCluster ? useAWSVPCInquiry() : useAWSVPCsFromCluster();

  const { pending: isVpcsLoading, fulfilled: isVpcsFulfilled, error: vpcsError } = vpcs;
  let vpcsItems: CloudVPC[] = vpcs.data?.items || [];
  if (selectedVPC) {
    vpcsItems = vpcsItems.filter((item: CloudVPC) => item.id === selectedVPC);
  }
  const subnetList: Subnetwork[] = [];
  const vpcsSubnetsMap = vpcsItems?.reduce((acc: Record<string, Subnetwork[]>, vpc: CloudVPC) => {
    const { aws_subnets: subnets } = vpc;

    if (subnets && subnets.length > 0) {
      subnets.forEach((subnet) => {
        if (subnet.availability_zone && isSubnetMatchingPrivacy(subnet, privacy)) {
          if (allowedAZ === undefined || allowedAZ.includes(subnet.availability_zone)) {
            if (acc[subnet.availability_zone]) {
              acc[subnet.availability_zone].push(subnet);
            } else {
              acc[subnet.availability_zone] = [subnet];
            }
            subnetList.push(subnet);
          }
        }
      });
    }

    return acc;
  }, {});
  const hasNoOptions = subnetList?.length === 0;

  const selectOptions = Object.entries(vpcsSubnetsMap || {}).map(([region, subnets]) => (
    <SelectGroup label={region} key={region}>
      {subnets.map((subnet) => (
        <SelectOption value={subnet} key={subnet.subnet_id}>
          {subnet.subnet_id}
        </SelectOption>
      ))}
    </SelectGroup>
  ));

  React.useEffect(() => {
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

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    selectedSubnet: string | SelectOptionObject,
  ) => {
    input.onChange(selectedSubnet);
    setSelectedSubnet(selectedSubnet);
    setIsExpanded(false);
  };

  const onFilter = (_: React.ChangeEvent<HTMLInputElement> | null, subnetId: string) => {
    if (subnetId === '') {
      return selectOptions;
    }

    const filterText = subnetId.toLowerCase();
    return selectOptions.reduce((acc: React.ReactElement[], group) => {
      const filteredGroup = React.cloneElement(group, {
        children: group.props.children.filter((childElement: React.ReactElement) => {
          const subnet = childElement.props.value;
          return subnet.subnet_id.toLowerCase().includes(filterText);
        }),
      });

      if (filteredGroup?.props.children.length > 0) {
        acc.push(filteredGroup);
      }

      return acc;
    }, []);
  };

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
        <ErrorBox message="Failed to fetch subnet IDs." response={vpcs} />
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
        <Select
          label={label}
          isOpen={isExpanded}
          selections={selectedSubnet?.subnet_id}
          onToggle={(isExpanded) => setIsExpanded(isExpanded)}
          onSelect={onSelect}
          onFilter={onFilter}
          isDisabled={isDisabled || hasNoOptions}
          inlineFilterPlaceholderText="Filter by subnet ID"
          placeholderText={hasNoOptions && 'No data found.'}
          validated={inputError ? 'error' : undefined}
          isGrouped
          hasInlineFilter
        >
          {selectOptions}
        </Select>
      )}
    </FormGroup>
  );
};
