import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import {
  GridItem,
  Radio,
  Stack,
  StackItem,
  Alert,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { randAlphanumString } from '../../../../../../../common/helpers';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import {
  required,
  validateHTPasswdPassword,
  validateHTPasswdUsername,
} from '../../../../../../../common/validators';
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

class HTPasswdForm extends React.Component {
  state = {
    useSuggestedUsername: true,
    suggestedUsername: `admin-${randAlphanumString(6)}`,
    useSuggestedPassword: true,
    suggestedPassword: generatePassword(),
  };

  componentDidMount() {
    const { change } = this.props;
    const { suggestedUsername, suggestedPassword } = this.state;
    change('htpasswd_password', suggestedPassword);
    change('htpasswd_username', suggestedUsername);
  }

  radioControlledInputGroup = ({
    isPassword = false,
    suggestedValueRadioLabel,
    createOwnRadioLabel,
    label,
    helpText,
    input,
    isPending,
    ...additionalProps
  }) => {
    const { useSuggestedPassword, useSuggestedUsername, suggestedPassword, suggestedUsername } =
      this.state;

    const suggestedValue = isPassword ? suggestedPassword : suggestedUsername;
    const useSuggestionIsChecked = isPassword ? useSuggestedPassword : useSuggestedUsername;

    const fieldValueMatcher =
      (fieldName, message = 'Passwords do not match') =>
      (value, allValues) =>
        allValues[fieldName] !== value ? message : undefined;

    return (
      <>
        <Stack>
          <StackItem className="pf-c-form__group-label">
            <p className="pf-c-form__label-text field-label">
              {label}
              <span className="pf-c-form__label-required">*</span>
            </p>
          </StackItem>
          <StackItem className="pf-u-mb-sm">
            <Radio
              label={suggestedValueRadioLabel}
              id={`use-suggested-${label.toLowerCase()}`}
              isChecked={useSuggestionIsChecked}
              onChange={() => {
                this.setState({
                  [isPassword ? 'useSuggestedPassword' : 'useSuggestedUsername']: true,
                });
                input.onChange(suggestedValue);
              }}
            />
          </StackItem>
          <StackItem className="pf-u-mb-sm">
            <Radio
              label={createOwnRadioLabel}
              id={`create-own-${label.toLowerCase()}`}
              isChecked={!useSuggestionIsChecked}
              onChange={() => {
                this.setState({
                  [isPassword ? 'useSuggestedPassword' : 'useSuggestedUsername']: false,
                });
                input.onChange('');
              }}
            />
          </StackItem>
          {!useSuggestionIsChecked && (
            <StackItem className="pf-u-mb-sm">
              <ReduxVerticalFormGroup
                name={input.name}
                type="text"
                disabled={isPending}
                validate={required}
                helpText={helpText}
                input={input}
                isPassword={isPassword}
                {...additionalProps}
              />
            </StackItem>
          )}
          {!useSuggestionIsChecked && isPassword && (
            <StackItem className="pf-u-mt-sm pf-u-mb-sm">
              <Field
                component={ReduxVerticalFormGroup}
                name={input.name + '_confirmation'}
                label="Confirm password"
                type="text"
                isPassword
                disabled={isPending}
                isRequired={additionalProps.isRequired}
                validate={[required, useCallback(fieldValueMatcher(input.name), [input.name])]}
              />
            </StackItem>
          )}
        </Stack>
      </>
    );
  };

  render() {
    const { isPending, HTPasswdPasswordErrors } = this.props;

    const { suggestedUsername, suggestedPassword } = this.state;

    const helpTextItemVariant = (errName) => {
      const emptyPassword = HTPasswdPasswordErrors?.emptyPassword;
      if (emptyPassword) {
        return 'default';
      }
      if (HTPasswdPasswordErrors === undefined) {
        return 'success';
      }
      const hasError = HTPasswdPasswordErrors[errName];
      return hasError ? 'error' : 'success';
    };

    const helpTextItemIcon = (errName) => {
      const variant = helpTextItemVariant(errName);
      switch (variant) {
        case 'success':
          return <CheckCircleIcon />;
        case 'error':
          return <ExclamationCircleIcon />;
        default:
          return <span>•</span>;
      }
    };

    const helpText = (
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

    return (
      <>
        <GridItem span={8} className="htpasswd-form">
          <Field
            component={this.radioControlledInputGroup}
            suggestedValueRadioLabel={
              <span>
                Use suggested username: <span className="suggestion">{suggestedUsername}</span>
              </span>
            }
            createOwnRadioLabel="Create your own username"
            name="htpasswd_username"
            label="Username"
            type="text"
            validate={[required, validateHTPasswdUsername]}
            isRequired
            disabled={isPending}
            helpText="Unique name of the user within the cluster. Username must not contain /, :, or %."
          />
        </GridItem>
        <GridItem span={8} className="htpasswd-form">
          <Field
            component={this.radioControlledInputGroup}
            isPassword
            hasOtherValidation
            suggestedValueRadioLabel={
              <span>
                Use suggested password: <span className="suggestion">{suggestedPassword}</span>
              </span>
            }
            createOwnRadioLabel="Create your own password"
            name="htpasswd_password"
            label="Password"
            type="text"
            validate={validateHTPasswdPassword}
            isRequired
            disabled={isPending}
            helpText={helpText}
          />
        </GridItem>
        <GridItem span={8}>
          <Alert isInline variant="info" title="Securely store your username and password">
            If you lose these credentials, you will have to delete and recreate the cluster admin
            user.
          </Alert>
        </GridItem>
      </>
    );
  }
}

HTPasswdForm.propTypes = {
  isPending: PropTypes.bool,
  change: PropTypes.func,
  input: PropTypes.object,
  HTPasswdPasswordErrors: {
    emptyPassword: PropTypes.bool,
    baseRequirements: PropTypes.bool,
    uppercase: PropTypes.bool,
    lowercase: PropTypes.bool,
    numbers: PropTypes.bool,
  },
};

HTPasswdForm.defaultProps = {
  isPending: false,
};

export default HTPasswdForm;
