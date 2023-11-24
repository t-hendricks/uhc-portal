import React from 'react';
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
import FuzzySelect, { FuzzyEntryType } from '~/components/common/FuzzySelect';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import {
  vpcHasPrivateSubnets,
  filterOutRedHatManagedVPCs,
  useAWSVPCInquiry,
} from '../VPCScreen/useVPCInquiry';
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
  isHypershift?: boolean;
  isOSD?: boolean;
}

const sortVPCOptions = (vpcA: FuzzyEntryType, vpcB: FuzzyEntryType) => {
  // Invalid VPCs must be kept last
  if (vpcA.disabled && !vpcB.disabled) {
    return 1;
  }
  if (vpcB.disabled && !vpcA.disabled) {
    return -1;
  }
  return vpcA.key.localeCompare(vpcB.key);
};

const VPCDropdown = ({
  selectedVPC,
  input: {
    // Redux Form's onBlur interferes with Patternfly's Select footer onClick handlers.
    onBlur: _onBlur,
    ...inputProps
  },
  meta: { error, touched },
  showRefresh = false,
  isHypershift = false,
  isOSD = false,
}: VCPDropdownProps) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const vpcResponse = useAWSVPCInquiry(isOSD);
  const originalVPCs = React.useMemo<CloudVPC[]>(() => {
    const vpcs = vpcResponse.data?.items || [];
    return isHypershift ? filterOutRedHatManagedVPCs(vpcs) : vpcs;
  }, [vpcResponse.data?.items, isHypershift]);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    selectedVPCID: string | SelectOptionObject,
  ) => {
    // We want the form to store the original VPC object, rather than the option items
    const selectedItem = originalVPCs.find(
      (vpc) => vpc.id === selectedVPCID || vpc.name === selectedVPCID,
    );
    if (selectedItem) {
      inputProps.onChange(selectedItem);
      setIsOpen(false);
    }
  };

  const selectData = React.useMemo(() => {
    let placeholder = 'Select a VPC';
    if (vpcResponse.pending) {
      placeholder = 'Loading...';
    } else if (originalVPCs.length === 0) {
      placeholder = 'No VPCs found';
    }

    const vpcOptions = originalVPCs.map((vpcItem) => {
      const isDisabledVPC = !vpcHasPrivateSubnets(vpcItem);
      const optionId = vpcItem.name || (vpcItem.id as string);
      return {
        key: optionId,
        value: optionId,
        description: isDisabledVPC ? 'This VPC has no private subnets' : '',
        disabled: isDisabledVPC,
      };
    });

    return {
      placeholder,
      options: vpcOptions,
    };
  }, [vpcResponse.pending, originalVPCs]);

  React.useEffect(() => {
    if (!selectedVPC) {
      return;
    }

    const isValidSelection = originalVPCs.some(
      (item) => item?.id === selectedVPC.id || item?.name === selectedVPC.name,
    );
    if (originalVPCs.length > 0 && (selectedVPC.id || selectedVPC.name) && !isValidSelection) {
      inputProps.onChange({ id: '', name: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVPC, originalVPCs]);

  const refreshVPCs = () => {
    if (vpcResponse.cloudProvider === 'aws') {
      inputProps.onChange({ id: '', name: '' });
      dispatch(
        getAWSCloudProviderVPCs({
          awsCredentials: vpcResponse.credentials,
          region: vpcResponse.region,
          options: isHypershift ? undefined : { includeSecurityGroups: true },
        }),
      );
    }
  };

  return (
    <>
      <FormGroup
        label={`Select a VPC to install your ${
          isHypershift ? 'machine pools' : 'cluster'
        } into your selected region: ${vpcResponse.region || ''}`}
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
              sortFn={sortVPCOptions}
              selected={selectedVPC?.name || selectedVPC?.id}
              selectionData={selectData.options}
              isDisabled={vpcResponse.pending || selectData.options.length === 0}
              placeholderText={selectData.placeholder}
              inlineFilterPlaceholderText="Filter by VPC"
              validated={touched && error ? 'error' : 'default'}
            />
          </FlexItem>
          {showRefresh && (
            <FlexItem>
              <Tooltip content={<p>Refresh</p>}>
                <Button
                  data-testid="refresh-vpcs"
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
