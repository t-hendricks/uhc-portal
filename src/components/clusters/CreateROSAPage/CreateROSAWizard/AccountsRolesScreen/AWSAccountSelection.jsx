// a redux-form Field-compatible component for selecting an associated AWS account id

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Select,
  SelectOption,
  FormGroup,
  Title,
  EmptyStateBody,
  EmptyState,
  Tooltip,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import PopoverHint from '../../../../common/PopoverHint';
import './AccountsRolesScreen.scss';
import links from '~/common/installLinks.mjs';
import { hasContract } from './AWSBillingAccount/awsBillingAccountHelper';

const AWS_ACCT_ID_PLACEHOLDER = 'Select an account';

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
  toggleAssociateAccountDrawer,
  isBillingAccount = false,
  refresh,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const associateAWSAccountBtnRef = React.createRef();
  const hasAWSAccounts = accounts?.length > 0;
  const { onRefresh, text } = refresh;

  useEffect(() => {
    // only scroll to associateAWSAccountBtn when no AWS accounts
    if (isOpen === true && !hasAWSAccounts) {
      associateAWSAccountBtnRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, hasAWSAccounts]);

  const onToggle = (toggleOpenValue) => {
    setIsOpen(toggleOpenValue);
  };

  const onSelect = (_, selection) => {
    setIsOpen(false);
    inputProps.onChange(selection);
  };

  const openDrawer = () => {
    // close dropdown
    setIsOpen(false);
    // will cause window reload on first time, then open assoc aws modal with new token
    toggleAssociateAccountDrawer();
  };

  const btnProps = isBillingAccount
    ? {
        component: 'a',
        href: links.AWS_CONSOLE_ROSA_HOME,
        target: '_blank',
      }
    : {
        onClick: () => {
          openDrawer();
        },
      };

  const footer = (
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

  return (
    <FormGroup
      label={label}
      labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
      className="aws-account-selection"
      validated={touched && error ? 'error' : undefined}
      helperTextInvalid={touched && error}
      isRequired
    >
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <Select
            {...inputProps}
            label={label}
            labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
            isOpen={isOpen}
            selections={hasAWSAccounts ? selectedAWSAccountID : ''}
            onToggle={onToggle}
            onSelect={onSelect}
            isDisabled={isDisabled}
            placeholderText={AWS_ACCT_ID_PLACEHOLDER}
            validated={touched && error ? 'error' : undefined}
            footer={footer}
          >
            {accounts?.map((cloudAccount) => (
              <SelectOption
                className="pf-c-dropdown__menu-item"
                key={cloudAccount.cloud_account_id}
                value={cloudAccount.cloud_account_id}
                description={
                  isBillingAccount && hasContract(cloudAccount) ? 'Contract enabled' : ''
                }
              >
                {cloudAccount.cloud_account_id}
              </SelectOption>
            ))}
          </Select>
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

AWSAccountSelection.propTypes = {
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }),
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  accounts: PropTypes.array,
  selectedAWSAccountID: PropTypes.string,
  toggleAssociateAccountDrawer: PropTypes.func,
  initialValue: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  refresh: PropTypes.shape({ onRefresh: PropTypes.func, text: PropTypes.string }).isRequired,
  isBillingAccount: PropTypes.bool,
};

export { AWS_ACCT_ID_PLACEHOLDER };

export default AWSAccountSelection;
