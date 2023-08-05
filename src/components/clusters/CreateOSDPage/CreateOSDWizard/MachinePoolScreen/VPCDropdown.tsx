import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Flex,
  FlexItem,
  FormGroup,
  SelectOptionObject,
  Tooltip,
} from '@patternfly/react-core';
import ErrorBox from '~/components/common/ErrorBox';
import FuzzySelect, { FuzzyDataType } from '~/components/common/FuzzySelect';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { filterVpcsOnlyPrivateSubnets, useAWSVPCInquiry } from '../VPCScreen/useVPCInquiry';
import { getAWSCloudProviderVPCs } from '../ccsInquiriesActions';

interface VCPDropdownProps {
  selectedVPC: CloudVPC;
  input: {
    value: string;
    onChange: (selectedVPC: CloudVPC | SelectOptionObject) => void;
    onBlur: () => void;
  };
  meta: {
    touched: boolean;
    error: string;
  };
  showRefresh?: boolean;
}

const VPCDropdown = ({
  selectedVPC,
  input: {
    // Redux Form's onBlur interferes with Patternfly's Select footer onClick handlers.
    onBlur: _onBlur,
    ...inputProps
  },
  meta: { error, touched },
  showRefresh = false,
}: VCPDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const vpcResponse = useAWSVPCInquiry();
  const { items } = vpcResponse.data as { items: CloudVPC[] };
  const dispatch = useDispatch();

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    selectedVPCID: string | SelectOptionObject,
  ) => {
    inputProps.onChange(
      selectData.items.find((vpc) => vpc?.name === selectedVPCID || vpc?.id === selectedVPCID) ?? {
        id: '',
        name: '',
      },
    );
    setIsOpen(false);
  };

  const selectData = React.useMemo(() => {
    const vpcItems = filterVpcsOnlyPrivateSubnets(items || []) as CloudVPC[];
    let placeholder = 'Select a VPC';
    if (vpcResponse.pending) {
      placeholder = 'Loading...';
    } else if (vpcItems.length === 0) {
      placeholder = 'No VPCs found';
    }

    return {
      placeholder,
      items: vpcItems,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vpcResponse.pending, vpcResponse.data?.items]);

  React.useEffect(() => {
    const isValidSelection = items?.some(
      (item) => item?.id === selectedVPC?.id || item?.name === selectedVPC?.name,
    );
    if (items && (selectedVPC?.id || selectedVPC?.name) && !isValidSelection) {
      inputProps.onChange({ id: '', name: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVPC, items]);

  const refreshVPCs = () => {
    if (vpcResponse.cloudProvider === 'aws') {
      dispatch(
        getAWSCloudProviderVPCs({
          awsCredentials: vpcResponse.credentials,
          region: vpcResponse.region,
        }),
      );
    }
  };
  const selectionData = useMemo<FuzzyDataType>(
    () =>
      selectData.items.map((vpcItem) => ({
        key: vpcItem.name! || vpcItem.id!,
        value: vpcItem.name || vpcItem.id,
        description: vpcItem.aws_subnets?.length === 0 ? 'This VPC has no private subnets' : '',
        disabled: vpcItem.aws_subnets?.length === 0,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectData.items],
  );

  return (
    <>
      <FormGroup
        label="Specify a VPC to install your machine pools into"
        validated={touched && error ? 'error' : 'default'}
        isRequired
      >
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <FuzzySelect
              {...inputProps}
              label="Select a VPC"
              aria-label="select VPC"
              isOpen={isOpen}
              onToggle={onToggle}
              onSelect={onSelect}
              selected={selectedVPC?.name || selectedVPC?.id}
              selectionData={selectionData}
              isDisabled={vpcResponse.pending || selectData.items.length === 0}
              placeholderText={selectData.placeholder}
              inlineFilterPlaceholderText="Filter by VPC"
              validated={touched && error ? 'error' : 'default'}
            />
          </FlexItem>
          {showRefresh && (
            <FlexItem>
              <Tooltip content={<p>Refresh</p>}>
                <Button
                  data-testid="refresh-aws-accounts"
                  isLoading={vpcResponse.pending}
                  isDisabled={vpcResponse.pending}
                  isInline
                  isSmall
                  variant="secondary"
                  onClick={refreshVPCs}
                >
                  Refresh
                </Button>
              </Tooltip>
            </FlexItem>
          )}
          {vpcResponse.error && <ErrorBox message="Error retrieving VPCs" response={vpcResponse} />}
        </Flex>
      </FormGroup>
    </>
  );
};

export default VPCDropdown;
