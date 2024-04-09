import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';
import { WrappedFieldInputProps, WrappedFieldMetaProps } from 'redux-form';

import { Button, Flex, FlexItem, FormGroup, Spinner, Tooltip } from '@patternfly/react-core';
import {
  Select as SelectDeprecated,
  SelectOption as SelectOptionDeprecated,
  SelectOptionObject as SelectOptionObjectDeprecated,
} from '@patternfly/react-core/deprecated';
import { CopyIcon } from '@patternfly/react-icons/dist/esm/icons/copy-icon';
import { TrashIcon } from '@patternfly/react-icons/dist/esm/icons/trash-icon';

import ErrorBox from '~/components/common/ErrorBox';
import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import { dnsDomainsActions } from '~/redux/actions/dnsDomainsActions';
import { useGlobalState } from '~/redux/hooks';

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
    selection: string | SelectOptionObjectDeprecated,
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
    <SelectOptionDeprecated key={domain.id} value={domain.id} isDisabled={isDisabled}>
      {domain.id}
    </SelectOptionDeprecated>
  ));

  // A hidden item to display the spinner while a new DNS domain is being created
  if (isUpdatingDomains) {
    selectOptions.unshift(
      <SelectOptionDeprecated key="loader" value={actionText} isPlaceholder>
        <div className="shared-vpc-loading-content">
          {actionText} <Spinner size="md" />
        </div>
      </SelectOptionDeprecated>,
    );
  }

  const onFilter = (_: React.ChangeEvent<HTMLInputElement> | null, filterText: string) => {
    if (filterText === '') {
      return selectOptions;
    }
    return selectOptions.filter((domainOption) => domainOption.props.value.includes(filterText));
  };

  return (
    <FormGroup label={label} isRequired className="shared-vpc-domain-select">
      <Flex>
        <FlexItem flex={{ default: 'flex_1' }} className="pf-v5-u-m-0">
          <SelectDeprecated
            isOpen={isOpen}
            selections={input.value || (isUpdatingDomains ? actionText : PLACEHOLDER_TEXT)}
            onToggle={(_event, isOpen: boolean) => onToggle(isOpen)}
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
                className="pf-v5-u-py-sm"
                onClick={createNewDnsDomain}
                isDisabled={isDisabled}
              >
                Reserve new base DNS domain
              </Button>
            }
          >
            {selectOptions}
          </SelectDeprecated>
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

      <FormGroupHelperText touched={meta.touched} error={meta.error} />
    </FormGroup>
  );
};

export default SharedVPCDomainSelect;
