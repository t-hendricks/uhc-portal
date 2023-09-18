import React from 'react';
import {
  Button,
  Select,
  SelectOption,
  FormGroup,
  SelectOptionObject,
  Spinner,
  Flex,
  FlexItem,
  Tooltip,
} from '@patternfly/react-core';
import { CopyIcon, TrashIcon } from '@patternfly/react-icons';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';

import { dnsDomainsActions } from '~/redux/actions/dnsDomainsActions';
import { useGlobalState } from '~/redux/hooks';
import ErrorBox from '~/components/common/ErrorBox';

import './SharedVPCDomainSelect.scss';

const PLACEHOLDER_TEXT = 'Select base DNS domain';
const CREATE_LOADER_TEXT = 'Reserving new base DNS domain...';
const DELETE_LOADER_TEXT = 'Deleting a base DNS domain...';

const MAX_SELECT_HEIGHT = 250; // List can be very long. MaxHeight is needed to keep the footer visible

interface SharedVPCDomainSelectProps {
  label: string;
  input: WrappedFieldInputProps;
  meta: WrappedFieldMetaProps;
}

const SharedVPCDomainSelect = ({ label, input, meta }: SharedVPCDomainSelectProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [actionText, setActionText] = React.useState<string>('');

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(dnsDomainsActions.getAvailableSharedVpcDnsDomains());
    dispatch(dnsDomainsActions.clearLastCreatedBaseDnsDomain());
  }, [dispatch]);

  const dnsDomainsResponse = useGlobalState((state) => state.dnsDomains);
  const {
    pending,
    isUpdatingDomains,
    createdDnsId,
    deletedDnsId,
    items: dnsDomains = [],
  } = dnsDomainsResponse;

  const isDisabled = pending || isUpdatingDomains;

  React.useEffect(() => {
    // Select the newly created domain
    if (!isUpdatingDomains && createdDnsId && input.value !== createdDnsId) {
      input.onChange(createdDnsId);
      dispatch(dnsDomainsActions.clearLastCreatedBaseDnsDomain());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatingDomains, createdDnsId, input.value, dispatch]);

  React.useEffect(() => {
    if (input.value === deletedDnsId) {
      input.onChange('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletedDnsId]);

  const onSelect = (
    _: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
  ) => {
    if (!isDisabled) {
      setIsOpen(false);
      input.onChange(selection);
    }
  };

  const onToggle = (isOpen: boolean) => {
    if (!isDisabled) {
      setIsOpen(isOpen);
    }
  };

  const createNewDnsDomain = () => {
    // Clear the selection in case an error happens, users notice it
    input.onChange('');
    setIsOpen(false);
    setActionText(CREATE_LOADER_TEXT);
    dispatch(dnsDomainsActions.createNewBaseDnsDomain());
  };

  const deleteBaseDnsDomain = () => {
    const id = input.value;
    setActionText(DELETE_LOADER_TEXT);
    dispatch(dnsDomainsActions.deleteBaseDnsDomain(id));
  };

  const selectOptions = dnsDomains.map((domain) => (
    <SelectOption key={domain.id} value={domain.id} isDisabled={isDisabled}>
      {domain.id}
    </SelectOption>
  ));

  // A hidden item to display the spinner while a new DNS domain is being created
  if (isUpdatingDomains) {
    selectOptions.unshift(
      <SelectOption key="loader" value={actionText} isPlaceholder>
        <div className="shared-vpc-loading-content">
          {actionText} <Spinner size="md" />
        </div>
      </SelectOption>,
    );
  }

  const onFilter = (_: React.ChangeEvent<HTMLInputElement> | null, filterText: string) => {
    if (filterText === '') {
      return selectOptions;
    }
    return selectOptions.filter((domainOption) => domainOption.props.value.includes(filterText));
  };

  return (
    <FormGroup
      label={label}
      validated={meta.error ? 'error' : undefined}
      helperTextInvalid={meta.touched && meta.error}
      isRequired
      className="shared-vpc-domain-select"
    >
      <Flex>
        <FlexItem flex={{ default: 'flex_1' }} className="pf-u-m-0">
          <Select
            isOpen={isOpen}
            selections={input.value || (isUpdatingDomains ? actionText : PLACEHOLDER_TEXT)}
            onToggle={onToggle}
            onSelect={onSelect}
            onFilter={onFilter}
            maxHeight={MAX_SELECT_HEIGHT}
            hasInlineFilter={selectOptions.length > 1}
            inlineFilterPlaceholderText="Filter by domain name"
            isDisabled={isDisabled}
            validated={input.value ? 'success' : undefined}
            footer={
              <Button
                isInline
                variant="link"
                className="pf-u-py-sm"
                onClick={createNewDnsDomain}
                isDisabled={isDisabled}
              >
                Reserve new base DNS domain
              </Button>
            }
          >
            {selectOptions}
          </Select>
        </FlexItem>

        <FlexItem grow={{ default: undefined }} className="dns-domain-action-icon">
          <CopyToClipboard text={input.value || ''}>
            <Button
              variant="link"
              type="button"
              tabIndex={0}
              isAriaDisabled={!input.value}
              icon={<CopyIcon />}
            />
          </CopyToClipboard>
          <Tooltip content="Clicking the icon will permanently delete the selected Base DNS domain">
            <Button
              variant="tertiary"
              type="button"
              tabIndex={0}
              isAriaDisabled={!input.value}
              onClick={deleteBaseDnsDomain}
              icon={<TrashIcon />}
            >
              Delete
            </Button>
          </Tooltip>
        </FlexItem>
      </Flex>

      {!isUpdatingDomains && !createdDnsId && dnsDomainsResponse.error && (
        <ErrorBox
          message={`Error ${
            actionText === CREATE_LOADER_TEXT ? 'creating' : 'deleting'
          } the DNS domain`}
          response={dnsDomainsResponse}
          showCloseBtn
          onCloseAlert={() => {
            dispatch(dnsDomainsActions.clearLastCreatedBaseDnsDomain());
          }}
        />
      )}
    </FormGroup>
  );
};

export default SharedVPCDomainSelect;
