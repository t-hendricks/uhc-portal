import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Flex,
  FlexItem,
  FormGroup,
  Select,
  SelectOption,
  SelectOptionObject,
  Tooltip,
} from '@patternfly/react-core';
import ErrorBox from '~/components/common/ErrorBox';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { filterVpcsOnlyPrivateSubnets, useAWSVPCInquiry } from '../VPCScreen/useVPCInquiry';
import { getAWSCloudProviderVPCs } from '../ccsInquiriesActions';

interface VCPDropdownProps {
  selectedVPCID: string;
  input: {
    value: string;
    onChange: (selectedVPC: string | SelectOptionObject) => void;
    onBlur: () => void;
  };
  meta: {
    touched: boolean;
    error: string;
  };
  showRefresh?: boolean;
}

const VPCDropdown = ({
  selectedVPCID,
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
    selectedVPC: string | SelectOptionObject,
  ) => {
    inputProps.onChange(selectedVPC);
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
  }, [vpcResponse.pending, vpcResponse.data?.items]);

  React.useEffect(() => {
    const isValidSelection = !selectedVPCID || items?.some((item) => item.id === selectedVPCID);
    if (!isValidSelection) {
      inputProps.onChange('');
    }
  }, [selectedVPCID, items]);

  const refreshVPCs = () => {
    if (vpcResponse.cloudProvider === 'aws') {
      dispatch(getAWSCloudProviderVPCs(vpcResponse.credentials, vpcResponse.region));
    }
  };

  return (
    <>
      <FormGroup
        label="Specify a VPC to install your machine pools into"
        validated={touched && error ? 'error' : undefined}
        isRequired
      >
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <Select
              {...inputProps}
              isOpen={isOpen}
              selections={selectedVPCID}
              onToggle={onToggle}
              onSelect={onSelect}
              placeholderText={selectData.placeholder}
              validated={touched && error ? 'error' : undefined}
              isDisabled={vpcResponse.pending || selectData.items.length === 0}
            >
              {selectData.items.map((vpcItem) => {
                const key = vpcItem.name || vpcItem.id;
                const vpcDescription =
                  vpcItem.aws_subnets?.length === 0 ? 'This VPC has no private subnets' : '';
                return (
                  <SelectOption
                    className="pf-c-dropdown__menu-item"
                    key={key}
                    value={vpcItem.id}
                    description={vpcDescription}
                    isDisabled={!!vpcDescription}
                  >
                    {key}
                  </SelectOption>
                );
              })}
            </Select>
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
