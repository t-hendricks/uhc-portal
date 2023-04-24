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

import { useAWSVPCInquiry } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/useVPCInquiry';
import ErrorBox from '~/components/common/ErrorBox';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';

enum Privacy {
  Public = 'public',
  Private = 'private',
}

interface SubnetSelectFieldProps {
  name: string;
  label: string;
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
  isDisabled?: boolean;
  isRequired?: boolean;
  className?: string;
  privacy?: 'public' | 'private';
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
}: SubnetSelectFieldProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [selectedSubnetId, setSelectedSubnetId] = React.useState(input.value);
  const vpcs = useAWSVPCInquiry();

  const { pending: isVpcsLoading, fulfilled: isVpcsFulfilled, error: vpcsError } = vpcs;
  const vpcsItems: CloudVPC[] = vpcs.data?.items;
  const subnetList: Subnetwork[] = [];
  const vpcsSubnetsMap = vpcsItems?.reduce((acc: Record<string, Subnetwork[]>, vpc: CloudVPC) => {
    const { aws_subnets: subnets } = vpc;

    if (subnets && subnets.length > 0) {
      subnets.forEach((subnet) => {
        if (
          (privacy === Privacy.Public && subnet.public) ||
          (privacy === Privacy.Private && !subnet.public) ||
          !privacy
        ) {
          if (subnet.availability_zone) {
            if (acc[subnet.availability_zone]) {
              acc[subnet.availability_zone].push(subnet);
            } else {
              acc[subnet.availability_zone] = [subnet];
            }
          }

          subnetList.push(subnet);
        }
      });
    }

    return acc;
  }, {});
  const hasNoOptions = subnetList?.length === 0;

  const selectOptions = Object.entries(vpcsSubnetsMap || {}).map(([region, subnets]) => (
    <SelectGroup label={region} key={region}>
      {subnets.map((subnet) => (
        <SelectOption value={subnet.subnet_id} key={subnet.subnet_id}>
          {subnet.subnet_id}
        </SelectOption>
      ))}
    </SelectGroup>
  ));

  // If no value was previously selected or if the current selected ID does not exist in the list,
  // default to the first selected value.
  React.useEffect(() => {
    if (
      isVpcsFulfilled &&
      (!selectedSubnetId || !subnetList.some((subnet) => subnet.subnet_id === selectedSubnetId))
    ) {
      const defaultSubnetId = subnetList[0]?.subnet_id;

      input.onChange(defaultSubnetId);
      setSelectedSubnetId(defaultSubnetId);
    }
  }, [isVpcsFulfilled, subnetList, selectedSubnetId]);

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
  ) => {
    input.onChange(value);
    setSelectedSubnetId(value);
    setIsExpanded(false);
  };

  const onFilter = (_: React.ChangeEvent<HTMLInputElement> | null, value: string) => {
    if (value === '') {
      return selectOptions;
    }

    return selectOptions.reduce((acc: React.ReactElement[], group) => {
      const filteredGroup = React.cloneElement(group, {
        children: group.props.children.filter((childElement: React.ReactElement) =>
          childElement.props.value.toLowerCase().includes(value.toLowerCase()),
        ),
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
      {vpcsError && <ErrorBox message="Failed to fetch subnet IDs." response={vpcs} />}

      {!isVpcsLoading && !vpcsItems.length && (
        <Alert variant="danger" isInline isPlain title="No VPCs found">
          A VPC with a public subnet must be associated with the selected AWS account ID.
        </Alert>
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
          selections={selectedSubnetId}
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
