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
} from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import PopoverHint from '../../../../common/PopoverHint';
import './AccountsRolesScreen.scss';

const AWS_ACCT_ID_PLACEHOLDER = 'Select an account';

function NoAssociatedAWSAccounts() {
  return (
    <EmptyState className="no-associated-aws-accounts_empty-state">
      <Title headingLevel="h6" size="md">
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
  label,
  meta: { error, touched },
  extendedHelpText,
  selectedAWSAccountID,
  AWSAccountIDs,
  launchAssocAWSAcctModal,
  initialValue,
}) {
  const { track } = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const associateAWSAccountBtnRef = React.createRef();

  useEffect(() => {
    // only scroll to associateAWSAccountBtn when no AWS account id selected
    if (isOpen === true && !selectedAWSAccountID && AWSAccountIDs.length === 0) {
      associateAWSAccountBtnRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, selectedAWSAccountID, AWSAccountIDs]);

  const onToggle = (toogleOpenValue) => {
    setIsOpen(toogleOpenValue);
  };

  const onSelect = (_, selection) => {
    setIsOpen(false);
    inputProps.onChange(selection);
  };

  const launchModal = () => {
    // close dropdown
    setIsOpen(false);
    // will cause window reload on first time, then open assoc aws modal with new token
    launchAssocAWSAcctModal();
  };

  const footer = (
    <>
      {AWSAccountIDs.length === 0 && <NoAssociatedAWSAccounts />}
      <Button
        ref={associateAWSAccountBtnRef}
        variant="secondary"
        onClick={(event) => {
          track(trackEvents.AssociateAWS);
          launchModal(event);
        }}
      >
        Associate AWS account
      </Button>
    </>
  );

  return (
    <FormGroup
      label={label}
      labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
      validated={error ? 'error' : undefined}
      helperTextInvalid={touched && error}
      isRequired
    >
      <Select
        {...inputProps}
        label={label}
        labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
        isOpen={isOpen}
        selections={inputProps.value || initialValue || ''}
        onToggle={onToggle}
        onSelect={onSelect}
        isDisabled={isDisabled}
        placeholderText={AWS_ACCT_ID_PLACEHOLDER}
        footer={footer}
      >
        {AWSAccountIDs.map((awsId) => (
          <SelectOption
            className="pf-c-dropdown__menu-item"
            key={awsId}
            value={awsId}
          >{`${awsId}`}</SelectOption>
        ))}
      </Select>
    </FormGroup>
  );
}

AWSAccountSelection.propTypes = {
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }),
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  AWSAccountIDs: PropTypes.arrayOf(PropTypes.string),
  selectedAWSAccountID: PropTypes.string,
  launchAssocAWSAcctModal: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export { AWS_ACCT_ID_PLACEHOLDER };

export default AWSAccountSelection;
