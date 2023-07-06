// a redux-form Field-compatible component for selecting an associated AWS account id

import React, {
  useState,
  useEffect,
  createRef,
  ReactElement,
  useCallback,
  ChangeEvent,
  useMemo,
  useRef,
} from 'react';
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
  ButtonProps,
} from '@patternfly/react-core';
import Fuse from 'fuse.js';
import './AccountsRolesScreen.scss';
import links from '~/common/installLinks.mjs';
import { CloudAccount } from '~/types/accounts_mgmt.v1';
import PopoverHint from '../../../../common/PopoverHint';
import { hasContract } from './AWSBillingAccount/awsBillingAccountHelper';
import { useAssociateAWSAccountDrawer } from './AssociateAWSAccountDrawer/AssociateAWSAccountDrawer';

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
}: AWSAccountSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const associateAWSAccountBtnRef = createRef<HTMLInputElement>();
  const hasAWSAccounts = accounts?.length > 0;
  const { onRefresh, text } = refresh;
  const { onChange } = inputProps;
  const ref = useRef<Select>(null);
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

  const selectOptions = useMemo<ReactElement[]>(
    () =>
      // assume largest numbers are the latest
      accounts
        .sort(({ cloud_account_id: a }, { cloud_account_id: b }) => {
          const ret = b.length - a.length;
          return ret || b.localeCompare(a);
        })
        .map((cloudAccount) => (
          <SelectOption
            className="pf-c-dropdown__menu-item"
            key={cloudAccount.cloud_account_id}
            value={cloudAccount.cloud_account_id}
            description={isBillingAccount && hasContract(cloudAccount) ? 'Contract enabled' : ''}
          >
            {cloudAccount.cloud_account_id}
          </SelectOption>
        )),
    [accounts],
  );

  const onFilter = useCallback(
    (_: ChangeEvent<HTMLInputElement> | null, account: string) => {
      if (account === '') {
        return selectOptions;
      }
      // create filtered map and sort by relevance
      const filterText = account.toLowerCase();
      const fuse = new Fuse(accounts, {
        ignoreLocation: true,
        threshold: 0.3,
        includeScore: true,
        includeMatches: true,
        keys: ['cloud_account_id'],
      });
      const matched: Array<Record<string, Array<string | ReactElement>>> = [];
      fuse
        .search<CloudAccount>(filterText)
        // most relevent towards top, then by number
        .sort(
          (
            { score: ax = 0, item: { cloud_account_id: aid = '' } },
            { score: bx = 0, item: { cloud_account_id: bid = '' } },
          ) => ax - bx || bid.length - aid.length || bid.localeCompare(aid),
        )
        .forEach(({ item: account, matches }) => {
          if (account) {
            if (account.cloud_account_id && matches) {
              let pos = 0;
              const accountId = account.cloud_account_id;
              const slicedId: Array<string | ReactElement> = [];
              matched.push({
                [account.cloud_account_id]: slicedId,
              });

              // highlight matches in boldface
              const arr = accountId.split(filterText);
              if (arr.length > 1) {
                // if exact matches
                arr.forEach((seg, inx) => {
                  slicedId.push(seg);
                  if (inx < arr.length - 1) slicedId.push(<b>{filterText}</b>);
                });
              } else {
                // fuzzy matches
                matches[0].indices
                  .filter(([beg, end]) => end - beg > 0)
                  .forEach(([beg, end]) => {
                    slicedId.push(accountId.slice(pos, beg));
                    slicedId.push(<b>{accountId.slice(beg, end + 1)}</b>);
                    pos = end + 1;
                  });
                if (pos < accountId.length) {
                  slicedId.push(accountId.slice(pos));
                }
              }
            }
          }
        });
      // create filtered select options
      return matched.map((cloudAccount) => (
        <SelectOption
          className="pf-c-dropdown__menu-item"
          key={Object.keys(cloudAccount)[0]}
          value={Object.keys(cloudAccount)[0]}
        >
          {Object.values(cloudAccount)}
        </SelectOption>
      ));
    },
    [accounts, selectOptions],
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
      isRequired
    >
      <Flex>
        <FlexItem grow={{ default: 'grow' }}>
          <Select
            label={label}
            isOpen={isOpen}
            selections={hasAWSAccounts ? selectedAWSAccountID : ''}
            onToggle={onToggle}
            onSelect={onSelect}
            onBlur={() => {
              // filter doesn't always clean up
              if (ref.current) {
                ref.current?.onClose();
              }
            }}
            ref={ref}
            onFilter={onFilter}
            isDisabled={isDisabled}
            placeholderText={AWS_ACCT_ID_PLACEHOLDER}
            inlineFilterPlaceholderText="Filter by account ID"
            hasInlineFilter
            validated={touched && error ? 'error' : undefined}
            footer={footer}
            aria-describedby="aws-infra-accounts"
          >
            {selectOptions}
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

export { AWS_ACCT_ID_PLACEHOLDER };

export default AWSAccountSelection;
