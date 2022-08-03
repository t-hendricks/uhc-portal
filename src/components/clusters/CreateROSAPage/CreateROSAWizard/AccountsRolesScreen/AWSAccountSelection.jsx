// a redux-form Field-compatible component for selecting an associated AWS account id

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Select, SelectOption,
  FormGroup,
  Title,
  EmptyStateBody, EmptyState,
} from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';
import { getTrackEvent, trackEvents } from '~/common/analytics';
import PopoverHint from '../../../../common/PopoverHint';
import './AccountsRolesScreen.scss';
import { loadOfflineToken } from '../../../../tokens/Tokens';
import { persistor } from '../../../../../redux/store';

const AWS_ACCT_ID_PLACEHOLDER = 'Select an account';

function NoAssociatedAWSAccounts() {
  return (
    <EmptyState className="no-associated-aws-accounts_empty-state">
      <Title headingLevel="h6" size="md">No associated accounts were found.</Title>
      <EmptyStateBody>
        Associate an AWS account to your Red Hat account.
      </EmptyStateBody>
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
  openAssociateAWSAccountModal,
  initialValue,
}) {
  const analytics = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const associateAWSAccountBtnRef = React.createRef();

  const onLoad = (token) => {
    openAssociateAWSAccountModal(token);
  };

  const onError = (reason) => {
    if (reason === 'not available') {
      // set token-reload to true, so that on reload we know to restore previously entered data
      window.localStorage.setItem('token-reload', 'true');
      // write state to localStorage
      persistor.flush().then(() => {
        insights.chrome.auth.doOffline();
      });
    } else {
      // open the modal anyways
      openAssociateAWSAccountModal(reason);
    }
  };

  useEffect(() => {
    // in case we reloaded the page after loading the offline token, reopen the modal
    if (window.localStorage.getItem('token-reload') === 'true') {
      window.localStorage.removeItem('token-reload');
      loadOfflineToken(onLoad, onError);
    }
  }, []);

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

  const onClick = () => {
    setIsOpen(false);
    // will cause window reload on first time
    loadOfflineToken(onLoad, onError);

    // Reset window onbeforeunload event so a browser confirmation dialog do not appear.
    window.onbeforeunload = null;
  };

  const footer = (
    <>
      {AWSAccountIDs.length === 0 && (
      <NoAssociatedAWSAccounts />
      )}
      <Button
        ref={associateAWSAccountBtnRef}
        variant="secondary"
        onClick={(event) => {
          const eventObj = getTrackEvent(trackEvents.AssociateAWS);
          analytics.track(eventObj.event, eventObj.properties);
          onClick(event);
        }}
      >
        Associate AWS account

      </Button>
    </>
  );

  return (
    <FormGroup
      label={label}
      labelIcon={extendedHelpText && (<PopoverHint hint={extendedHelpText} />)}
      validated={error ? 'error' : undefined}
      helperTextInvalid={touched && error}
      isRequired
    >
      <Select
        {...inputProps}
        label={label}
        labelIcon={extendedHelpText && (<PopoverHint hint={extendedHelpText} />)}
        isOpen={isOpen}
        selections={inputProps.value || initialValue || ''}
        onToggle={onToggle}
        onSelect={onSelect}
        isDisabled={isDisabled}
        placeholderText={AWS_ACCT_ID_PLACEHOLDER}
        footer={footer}
      >
        {AWSAccountIDs.map(awsId => <SelectOption className="pf-c-dropdown__menu-item" key={awsId} value={awsId}>{`${awsId}`}</SelectOption>)}
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
  openAssociateAWSAccountModal: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
};

export {
  AWS_ACCT_ID_PLACEHOLDER,
};

export default AWSAccountSelection;
