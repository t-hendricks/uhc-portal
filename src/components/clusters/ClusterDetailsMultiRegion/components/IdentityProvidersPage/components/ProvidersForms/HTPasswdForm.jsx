import React from 'react';
import PropTypes from 'prop-types';

import { Alert, GridItem, HelperText, HelperTextItem } from '@patternfly/react-core';
import { CheckCircleIcon } from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import { ExclamationCircleIcon } from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

import { useFormState } from '~/components/clusters/wizards/hooks';
import { CompoundFieldArray } from '~/components/common/FormikFormComponents/FormikFieldArray/CompoundFieldArray';

import {
  composeValidators,
  required,
  validateHTPasswdPassword,
  validateHTPasswdUsername,
  validateUniqueHTPasswdUsername,
} from '../../../../../../../common/validators';
import { FieldId } from '../../constants';

import './HTPasswdForm.scss';

const generatePassword = () => {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const symbols = '0123456789\\!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
  const passwordLength = 14;
  const all = `${lower}${upper}${symbols}`;

  const getRandomIndex = (charset) => {
    // A large range 2**32 gives a practically uniform distribution after modulo operation.
    const result = new Uint32Array(1);
    crypto.getRandomValues(result);
    return result[0] % charset.length;
  };

  const getRandom = (charset) => {
    const index = getRandomIndex(charset);
    return { index, value: charset[index] };
  };

  // baseline password
  const suggestion = new Array(passwordLength).fill(null).map(() => getRandom(all).value);

  // make sure at least 1 upper, 1 lower, 1 symbol/digit
  const availableIndices = suggestion.map((_, i) => i);

  // get distinct random indices for each type
  const upperIndex = getRandom(availableIndices);
  suggestion[upperIndex.value] = getRandom(upper).value;
  availableIndices.splice(upperIndex.index, 1);

  const lowerIndex = getRandom(availableIndices);
  suggestion[lowerIndex.value] = getRandom(lower).value;
  availableIndices.splice(lowerIndex.index, 1);

  const symbolIndex = getRandom(availableIndices);
  suggestion[symbolIndex.value] = getRandom(symbols).value;
  availableIndices.splice(lowerIndex.index, 1);

  return suggestion.join('');
};

const getHelpTextItemVariant = (errName, passwordErrors) => {
  const emptyPassword = passwordErrors?.emptyPassword;
  if (emptyPassword) {
    return 'default';
  }
  if (passwordErrors === undefined) {
    return 'success';
  }
  const hasError = passwordErrors[errName];
  return hasError ? 'error' : 'success';
};

const getHelpTextItemIcon = (errName, passwordErrors) => {
  const variant = getHelpTextItemVariant(errName, passwordErrors);
  switch (variant) {
    case 'success':
      return <CheckCircleIcon />;
    case 'error':
      return <ExclamationCircleIcon />;
    default:
      return <span>•</span>;
  }
};

const HelpTextPassword = ({ passwordErrors }) => {
  const helpTextItemVariant = (errName) => getHelpTextItemVariant(errName, passwordErrors);
  const helpTextItemIcon = (errName) => getHelpTextItemIcon(errName, passwordErrors);

  return (
    <HelperText>
      <HelperTextItem
        isDynamic
        variant={helpTextItemVariant('baseRequirements')}
        icon={helpTextItemIcon('baseRequirements')}
      >
        At least 14 characters (ASCII-standard) without whitespaces
      </HelperTextItem>
      <HelperTextItem
        isDynamic
        variant={helpTextItemVariant('lowercase')}
        icon={helpTextItemIcon('lowercase')}
      >
        Include lowercase letters
      </HelperTextItem>
      <HelperTextItem
        isDynamic
        variant={helpTextItemVariant('uppercase')}
        icon={helpTextItemIcon('uppercase')}
      >
        Include uppercase letters
      </HelperTextItem>
      <HelperTextItem
        isDynamic
        variant={helpTextItemVariant('numbersOrSymbols')}
        icon={helpTextItemIcon('numbersOrSymbols')}
      >
        Include numbers or symbols (ASCII-standard characters only)
      </HelperTextItem>
    </HelperText>
  );
};

HelpTextPassword.propTypes = {
  passwordErrors: PropTypes.shape({
    emptyPassword: PropTypes.bool,
    baseRequirements: PropTypes.bool,
    uppercase: PropTypes.bool,
    lowercase: PropTypes.bool,
    numbers: PropTypes.bool,
    numbersOrTypes: PropTypes.bool,
  }),
};

const HTPasswdForm = ({ isPending }) => {
  const { getFieldMeta, setFieldValue } = useFormState();
  const getAutocompleteText = (value) => (
    <div>
      Use suggested password:
      <br />
      <b>{`${value}`}</b>
    </div>
  );

  const onAutocomplete = (value, pwdField) => {
    setFieldValue(pwdField, value);
    setFieldValue(`${pwdField}-confirm`, value);
  };

  const getHelpText = (index) => {
    const { error } = getFieldMeta(`users.${index}.password`);
    return <HelpTextPassword passwordErrors={error} />;
  };

  const { error } = getFieldMeta(FieldId.USERS);
  const addMoreButtonDisabled = error && error?.length !== 0;

  return (
    <>
      <CompoundFieldArray
        fieldSpan={11}
        compoundFields={[
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            helpText: 'Unique name of the user within the cluster.',
            isRequired: true,
            getPlaceholderText: (index) => `Unique username ${index + 1}`,
            validate: composeValidators(required, validateHTPasswdUsername),
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            isRequired: true,
            getHelpText,
            onAutocomplete,
            getAutocompleteValue: generatePassword,
            getAutocompleteText,
            validate: validateHTPasswdPassword,
          },
          {
            name: 'password-confirm',
            label: 'Confirm password',
            type: 'password',
            isRequired: true,
            helpText: 'Retype the password to confirm.',
          },
        ]}
        label="Users list"
        addMoreTitle="Add user"
        isRequired
        disabled={isPending}
        validate={[validateUniqueHTPasswdUsername]}
        addMoreButtonDisabled={addMoreButtonDisabled}
        minusButtonDisabledMessage="To delete the static user, add another user first."
      />
      <GridItem span={11}>
        <Alert isInline variant="info" title="Securely store your usernames and passwords">
          If you lose these credentials, you will have to delete and recreate the users.
        </Alert>
      </GridItem>
    </>
  );
};

HTPasswdForm.propTypes = {
  isPending: PropTypes.bool,
};

HTPasswdForm.defaultProps = {
  isPending: false,
};

export default HTPasswdForm;
