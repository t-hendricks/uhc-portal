import React, {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';
import {
  Alert,
  Flex,
  FormGroup,
  KeyTypes,
  Select,
  SelectGroup,
  SelectOption,
  SelectOptionObject,
  Spinner,
} from '@patternfly/react-core';
import Fuse from 'fuse.js';

import { useAWSVPCsFromCluster } from '~/components/clusters/ClusterDetails/components/MachinePools/components/AddMachinePoolModal/useAWSVPCsFromCluster';
import {
  isSubnetMatchingPrivacy,
  useAWSVPCInquiry,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/VPCScreen/useVPCInquiry';
import ErrorBox from '~/components/common/ErrorBox';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';

const TRUNCATE_THRESHOLD = 50;

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
  const containerRef = useRef<HTMLDivElement>(null);

  const { pending: isVpcsLoading, fulfilled: isVpcsFulfilled, error: vpcsError } = vpcs;

  // if subnets have the more descriptive name, use that
  const { vpcsItems, subnetList, vpcsSubnetsMap, hasNoOptions, hasSubnetNames } = useMemo<{
    vpcsItems: CloudVPC[];
    subnetList: Subnetwork[];
    vpcsSubnetsMap: Record<string, Subnetwork[]>;
    hasNoOptions: boolean;
    hasSubnetNames: boolean;
  }>(() => {
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
    const hasSubnetNames = !hasNoOptions && subnetList.every((subnet) => !!subnet.name);
    return { vpcsItems, subnetList, vpcsSubnetsMap, hasNoOptions, hasSubnetNames };
  }, [vpcs.data?.items, selectedVPC]);

  useEffect(() => {
    if (isExpanded) {
      if (containerRef.current) {
        // Patternfly's inline filter up/down arrow keys are captured and used for navigating the options
        // unfortunately it also captures left/right which means you can't move the caret around your filter input text
        // this code grabs left/right arrows before they bubble up to the input and PF kills them
        const input = containerRef.current.getElementsByClassName(
          'pf-c-form-control pf-m-search',
        )[0] as HTMLInputElement;
        input.onkeydown = (e) => {
          if (e.key === KeyTypes.ArrowLeft || e.key === KeyTypes.ArrowRight) {
            e.stopPropagation();
          }
        };
      }
    }
  }, [isExpanded]);

  const selectOptions = useMemo<ReactElement[]>(
    () =>
      Object.entries(vpcsSubnetsMap || {})
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([region, subnets]) => (
          <SelectGroup label={region} key={region}>
            {subnets.map((subnet) => (
              <SelectOption value={subnet} key={subnet.subnet_id}>
                {hasSubnetNames ? subnet.name : subnet.subnet_id}
              </SelectOption>
            ))}
          </SelectGroup>
        )),
    [vpcsSubnetsMap],
  );

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

  const onFilter = useCallback(
    (_: ChangeEvent<HTMLInputElement> | null, subnetName: string) => {
      if (subnetName === '') {
        return selectOptions;
      }

      // create filtered map and sort by relevance
      const filterText = subnetName.toLowerCase();
      const fuse = new Fuse(subnetList, {
        ignoreLocation: true,
        threshold: 0.05,
        includeScore: true,
        includeMatches: true,
        keys: [hasSubnetNames ? 'name' : 'subnet_id'],
      });
      const filteredVpcsSubnetsMap: Record<string, Subnetwork[]> = {};
      const matchMap: Record<string, Array<string | ReactElement>> = {};
      fuse
        .search<Subnetwork>(filterText)
        .sort(
          (
            { score: ax = 0, item: { availability_zone: azone = '' } },
            { score: bx = 0, item: { availability_zone: bzone = '' } },
          ) => ax - bx || azone.localeCompare(bzone),
        )
        .forEach(({ item: subnet, matches }) => {
          if (subnet) {
            if (subnet.subnet_id && subnet.name && matches) {
              let pos = 0;
              const subnetId = subnet.subnet_id;
              const subnetName = hasSubnetNames ? subnet.name : subnet.subnet_id;
              matchMap[subnetId] = [];

              // highlight matches in boldface
              const arr = subnetName.split(filterText);
              if (arr.length > 1) {
                // if exact matches
                arr.forEach((seg, inx) => {
                  matchMap[subnetId].push(seg);
                  if (inx < arr.length - 1) matchMap[subnetId].push(<b>{filterText}</b>);
                });
              } else {
                // fuzzy matches
                matches[0].indices.forEach(([beg, end]) => {
                  matchMap[subnetId].push(subnetName.slice(pos, beg));
                  matchMap[subnetId].push(<b>{subnetName.slice(beg, end + 1)}</b>);
                  pos = end + 1;
                });
                if (pos < subnetName.length) {
                  matchMap[subnetId].push(subnetName.slice(pos));
                }
              }
            }
            if (subnet.availability_zone) {
              if (filteredVpcsSubnetsMap[subnet.availability_zone]) {
                filteredVpcsSubnetsMap[subnet.availability_zone].push(subnet);
              } else {
                filteredVpcsSubnetsMap[subnet.availability_zone] = [subnet];
              }
            }
          }
        });

      // create filtered select options
      return Object.entries(filteredVpcsSubnetsMap).map(([region, subnets]) => (
        <SelectGroup label={region} key={region}>
          {subnets.map((subnet) => {
            const otherName = hasSubnetNames ? subnet.name : subnet.subnet_id;
            return (
              <SelectOption value={subnet} key={subnet.subnet_id}>
                {subnet.subnet_id && matchMap[subnet.subnet_id] && matchMap[subnet.subnet_id].length
                  ? matchMap[subnet.subnet_id]
                  : otherName}
              </SelectOption>
            );
          })}
        </SelectGroup>
      ));
    },
    [subnetList, selectOptions],
  );

  let selectedSubnetName = hasSubnetNames ? selectedSubnet?.name : selectedSubnet?.subnet_id;
  if (selectedSubnetName && selectedSubnetName.length > TRUNCATE_THRESHOLD) {
    selectedSubnetName = `${selectedSubnetName.slice(
      0,
      TRUNCATE_THRESHOLD / 3,
    )}... ${selectedSubnetName.slice((-TRUNCATE_THRESHOLD * 2) / 3)}`;
  }

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
        <div ref={containerRef}>
          <Select
            label={label}
            aria-label={label}
            isOpen={isExpanded}
            selections={selectedSubnetName}
            onToggle={(isExpanded) => setIsExpanded(isExpanded)}
            onSelect={onSelect}
            onFilter={onFilter}
            isDisabled={isDisabled || hasNoOptions}
            inlineFilterPlaceholderText={`Filter by subnet ${hasSubnetNames ? 'name' : 'ID'}`}
            placeholderText={
              hasNoOptions ? 'No data found.' : `${hasSubnetNames ? 'Subnet name' : 'Subnet ID'}`
            }
            validated={inputError ? 'error' : undefined}
            isGrouped
            hasInlineFilter
          >
            {selectOptions}
          </Select>
        </div>
      )}
    </FormGroup>
  );
};
