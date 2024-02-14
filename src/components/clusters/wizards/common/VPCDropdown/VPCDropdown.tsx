import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Flex, FlexItem, FormGroup, Tooltip } from '@patternfly/react-core';
import { SelectOptionObject as SelectOptionObjectDeprecated } from '@patternfly/react-core/deprecated';
import ErrorBox from '~/components/common/ErrorBox';
import FuzzySelect, { FuzzyEntryType } from '~/components/common/FuzzySelect';
import { VPCResponse } from '~/redux/reducers/ccsInquiriesReducer';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import { AWSCredentials, ErrorState } from '~/types/types';
import { useAWSVPCInquiry } from '~/components/clusters/common/useVPCInquiry';
import { filterOutRedHatManagedVPCs, vpcHasPrivateSubnets } from '~/common/vpcHelpers';
import { getAWSCloudProviderVPCs } from '~/redux/actions/ccsInquiriesActions';

interface VCPDropdownProps {
  selectedVPC: CloudVPC;
  input: {
    value: string;
    onChange: (selectedVPC: CloudVPC | SelectOptionObjectDeprecated) => void;
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

interface UseAWSVPCInquiry {
  vpcs: VPCResponse & { pending: boolean; fulfilled: boolean; error: boolean };
  requestParams: { region: string; cloudProviderID: string; credentials: AWSCredentials };
}

const sortVPCOptions = (vpcA: FuzzyEntryType, vpcB: FuzzyEntryType) => {
  // Invalid VPCs must be kept last
  if (vpcA.disabled && !vpcB.disabled) {
    return 1;
  }
  if (vpcB.disabled && !vpcA.disabled) {
    return -1;
  }
  return vpcA.label.localeCompare(vpcB.label);
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

  const { vpcs: vpcResponse, requestParams } = useAWSVPCInquiry(isOSD) as UseAWSVPCInquiry;
  const originalVPCs = React.useMemo<CloudVPC[]>(
    () => filterOutRedHatManagedVPCs(vpcResponse.data?.items || []),
    [vpcResponse.data?.items],
  );

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    selectedVPCID: string | SelectOptionObjectDeprecated,
  ) => {
    // We want the form to store the original VPC object, rather than the option items
    const selectedItem = originalVPCs.find((vpc) => vpc.id === selectedVPCID);
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
      const optionId = vpcItem.id as string;
      return {
        entryId: optionId,
        label: vpcItem.name || optionId,
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

    const isValidSelection = originalVPCs.some((item) => item?.id === selectedVPC.id);
    if (originalVPCs.length > 0 && selectedVPC.id && !isValidSelection) {
      inputProps.onChange({ id: '', name: '' } as SelectOptionObjectDeprecated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVPC, originalVPCs]);

  const refreshVPCs = () => {
    if (requestParams.cloudProviderID === 'aws') {
      inputProps.onChange({ id: '', name: '' } as SelectOptionObjectDeprecated);
      dispatch(
        getAWSCloudProviderVPCs({
          region: requestParams.region,
          awsCredentials: requestParams.credentials,
          options: isHypershift ? undefined : { includeSecurityGroups: true },
        }),
      );
    }
  };

  return (
    <FormGroup
      label={`Select a VPC to install your ${
        isHypershift ? 'machine pools' : 'cluster'
      } into your selected region: ${requestParams.region || ''}`}
      isRequired
    >
      <Flex>
        {/* The min-width property is necessary to allow PF Select to truncate overflowing text. See OCMUI-796 for more details.
           This is likely to be removed when dropping deprecated Select component used by FuzzySelect */}
        <FlexItem flex={{ default: 'flex_1' }} style={{ minWidth: 0 }}>
          <FuzzySelect
            label="Select a VPC"
            aria-label="select VPC"
            isOpen={isOpen}
            onToggle={onToggle}
            onSelect={onSelect}
            sortFn={sortVPCOptions}
            selectedEntryId={selectedVPC?.id}
            selectionData={selectData.options}
            isDisabled={vpcResponse.pending || selectData.options.length === 0}
            placeholderText={selectData.placeholder}
            inlineFilterPlaceholderText="Filter by VPC ID / name"
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
                size="sm"
                variant="secondary"
                onClick={refreshVPCs}
              >
                Refresh
              </Button>
            </Tooltip>
          </FlexItem>
        )}
        {vpcResponse.error && (
          <ErrorBox message="Error retrieving VPCs" response={vpcResponse as ErrorState} />
        )}
      </Flex>
    </FormGroup>
  );
};

export default VPCDropdown;
