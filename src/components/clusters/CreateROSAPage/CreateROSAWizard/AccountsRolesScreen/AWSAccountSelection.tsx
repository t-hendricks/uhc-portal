// a redux-form Field-compatible component for selecting an associated AWS account id

import React, { useState, useEffect, createRef, ReactElement, useCallback, useMemo } from 'react';
import {
  Button,
  FormGroup,
  Title,
  EmptyStateBody,
  EmptyState,
  Tooltip,
  Flex,
  FlexItem,
  ButtonProps,
} from '@patternfly/react-core';
import './AccountsRolesScreen.scss';
import links from '~/common/installLinks.mjs';
import { CloudAccount } from '~/types/accounts_mgmt.v1';
import PopoverHint from '../../../../common/PopoverHint';
import { hasContract } from './AWSBillingAccount/awsBillingAccountHelper';
import { useAssociateAWSAccountDrawer } from './AssociateAWSAccountDrawer/AssociateAWSAccountDrawer';
import FuzzySelect, { FuzzyDataType, FuzzyEntryType } from '../../../../common/FuzzySelect';

const AWS_ACCT_ID_PLACEHOLDER = 'Select an account';
export const AWS_ACCOUNT_ROSA_LOCALSTORAGE_KEY = 'rosaAwsAccount';

function NoAssociatedAWSAccounts() {
  return (
    <EmptyState className="no-associated-aws-accounts_empty-state">
      <Title headingLevel="h6" size="md" data-testid="no_associated_accounts">
        No associated accounts were found.
      </Title>
      <EmptyStateBody>Associate an AWS account to your Red Hat account.</EmptyStateBody>
    </EmptyState>
  );
}

function sortFn(a: FuzzyEntryType, b: FuzzyEntryType) {
  const ret = b.key.length - a.key.length;
  return ret || b.key.localeCompare(a.key);
}
export interface AWSAccountSelectionProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  label?: string;
  input: {
    value?: string;
    onChange?: any;
    onBlur: any;
  };
  extendedHelpText: string | ReactElement;
  accounts: CloudAccount[];
  selectedAWSAccountID?: string;
  initialValue?: string;
  meta: {
    touched?: boolean;
    error?: string;
  };
  refresh: {
    onRefresh: any;
    text: string;
  };
  isBillingAccount?: boolean;
  clearGetAWSAccountIDsResponse: () => void;
  required?: boolean;
}

function AWSAccountSelection({
  input: {
    // Redux Form's onBlur interferes with Patternfly's Select footer onClick handlers.
    onBlur: _onBlur,
    ...inputProps
  },
  isDisabled,
  isLoading,
  label,
  meta: { error, touched },
  extendedHelpText,
  selectedAWSAccountID,
  accounts,
  isBillingAccount = false,
  refresh,
  clearGetAWSAccountIDsResponse,
  required = true,
}: AWSAccountSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const associateAWSAccountBtnRef = createRef<HTMLInputElement>();
  const hasAWSAccounts = accounts?.length > 0;
  const { onRefresh, text } = refresh;
  const { onChange } = inputProps;
  const { openDrawer } = useAssociateAWSAccountDrawer();

  useEffect(() => {
    // only scroll to associateAWSAccountBtn when no AWS accounts
    if (isOpen === true && !hasAWSAccounts) {
      associateAWSAccountBtnRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, hasAWSAccounts]);

  const onToggle = useCallback(
    (toggleOpenValue: boolean | ((prevState: boolean) => boolean)) => {
      setIsOpen(toggleOpenValue);
    },
    [setIsOpen],
  );

  const onSelect = useCallback(
    (_: any, selection: any) => {
      setIsOpen(false);
      onChange(selection);
      localStorage.setItem(AWS_ACCOUNT_ROSA_LOCALSTORAGE_KEY, selection);
    },
    [setIsOpen, onChange],
  );

  const selectionData = useMemo<FuzzyDataType>(
    () =>
      accounts.map((cloudAccount) => ({
        key: cloudAccount.cloud_account_id,
        value: cloudAccount.cloud_account_id,
        description: isBillingAccount && hasContract(cloudAccount) ? 'Contract enabled' : '',
      })),
    [accounts],
  );

  const onClick = useCallback(() => {
    // close dropdown
    setIsOpen(false);
    // will cause window reload on first time, then open assoc aws modal with new token
    openDrawer({ onClose: clearGetAWSAccountIDsResponse });
  }, [openDrawer, setIsOpen]);

  const footer = useMemo<ReactElement>(() => {
    const btnProps: ButtonProps = isBillingAccount
      ? {
          component: 'a',
          href: links.AWS_CONSOLE_ROSA_HOME,
          target: '_blank',
        }
      : {
          onClick,
        };

    return (
      <>
        {!hasAWSAccounts && <NoAssociatedAWSAccounts />}
        <Button
          ref={associateAWSAccountBtnRef}
          data-testid="launch-associate-account-btn"
          variant="secondary"
          {...btnProps}
        >
          {isBillingAccount
            ? 'Connect ROSA to a new AWS billing account'
            : 'How to associate a new AWS account'}
        </Button>
      </>
    );
  }, [hasAWSAccounts, isBillingAccount, associateAWSAccountBtnRef]);

  return (
    <FormGroup
      label={label}
      labelIcon={extendedHelpText ? <PopoverHint hint={extendedHelpText} /> : undefined}
      className="aws-account-selection"
      validated={touched && error ? 'error' : undefined}
      helperTextInvalid={touched && error}
      isRequired={required}
    >
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <FuzzySelect
            label={label}
            isOpen={isOpen}
            selected={hasAWSAccounts ? selectedAWSAccountID : ''}
            selectionData={selectionData}
            onToggle={onToggle}
            onSelect={onSelect}
            sortFn={sortFn}
            isDisabled={isDisabled}
            placeholderText={AWS_ACCT_ID_PLACEHOLDER}
            inlineFilterPlaceholderText="Filter by account ID"
            filterValidate={{ pattern: /[\D]/g, message: 'Please enter numeric digits only.' }}
            validated={touched && error ? 'error' : undefined}
            // lastValueStorageKey={AWS_ACCOUNT_ROSA_LOCALSTORAGE_KEY}
            footer={footer}
            aria-describedby="aws-infra-accounts"
          />
        </FlexItem>
        {onRefresh && (
          <FlexItem>
            <Tooltip content={<p>{text}</p>}>
              <Button
                data-testid="refresh-aws-accounts"
                isLoading={isLoading}
                isDisabled={isDisabled}
                isInline
                isSmall
                variant="secondary"
                onClick={() => {
                  onRefresh();
                }}
              >
                Refresh
              </Button>
            </Tooltip>
          </FlexItem>
        )}
      </Flex>
    </FormGroup>
  );
}

export { AWS_ACCT_ID_PLACEHOLDER };

export default AWSAccountSelection;
