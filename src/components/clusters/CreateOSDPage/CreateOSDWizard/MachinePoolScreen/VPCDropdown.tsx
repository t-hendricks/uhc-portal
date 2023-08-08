import React, { useState } from 'react';
import { FormGroup, Select, SelectOption, SelectOptionObject } from '@patternfly/react-core';
import ErrorBox from '~/components/common/ErrorBox';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { filterVpcsOnlyPrivateSubnets, useAWSVPCInquiry } from '../VPCScreen/useVPCInquiry';

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
}

const VPCDropdown = ({
  selectedVPCID,
  input: {
    // Redux Form's onBlur interferes with Patternfly's Select footer onClick handlers.
    onBlur: _onBlur,
    ...inputProps
  },
  meta: { error, touched },
}: VCPDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const vpcResponse = useAWSVPCInquiry();
  const { items } = vpcResponse.data as { items: CloudVPC[] };

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

  return (
    <>
      <FormGroup
        label="Specify a VPC to install your machine pools into"
        validated={touched && error ? 'error' : undefined}
        isRequired
      >
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
        {vpcResponse.error && <ErrorBox message="Error retrieving VPCs" response={vpcResponse} />}
      </FormGroup>
    </>
  );
};

export default VPCDropdown;
