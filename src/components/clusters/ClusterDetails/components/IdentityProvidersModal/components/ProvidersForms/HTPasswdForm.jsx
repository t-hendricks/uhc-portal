import React from 'react';
import { Field } from 'redux-form';
import {
  GridItem, Radio, Stack, StackItem, Alert,
} from '@patternfly/react-core';
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
  const suggestion = new Array(passwordLength).fill(null).map(
    () => getRandom(all).value,
  );

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
  }

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
    const {
      useSuggestedPassword,
      useSuggestedUsername,
      suggestedPassword,
      suggestedUsername,
    } = this.state;

    const suggestedValue = isPassword ? suggestedPassword : suggestedUsername;
    const useSuggestionIsChecked = isPassword ? useSuggestedPassword : useSuggestedUsername;

    return (
      <>
        <Stack>
          <StackItem className="pf-c-form__group-label">
            <p className="pf-c-form__label-text field-label">
              {label}
              <span className="pf-c-form__label-required">*</span>
            </p>
          </StackItem>
          <StackItem className="field-radio-control">
            <Radio
              label={suggestedValueRadioLabel}
              id={`use-suggested-${label.toLowerCase()}`}
              isChecked={useSuggestionIsChecked}
              onChange={() => {
                this.setState({ [isPassword ? 'useSuggestedPassword' : 'useSuggestedUsername']: true });
                input.onChange(suggestedValue);
              }}
            />
          </StackItem>
          <StackItem className="field-radio-control">
            <Radio
              label={createOwnRadioLabel}
              id={`create-own-${label.toLowerCase()}`}
              isChecked={!useSuggestionIsChecked}
              onChange={() => {
                this.setState({ [isPassword ? 'useSuggestedPassword' : 'useSuggestedUsername']: false });
                input.onChange('');
              }}
            />
          </StackItem>
          { !useSuggestionIsChecked && (
          <StackItem>
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
        </Stack>
      </>
    );
  };

  render() {
    const {
      isPending,
    } = this.props;

    const {
      suggestedUsername,
      suggestedPassword,
    } = this.state;

    return (
      <>
        <GridItem span={8} className="htpasswd-form">
          <Field
            component={this.radioControlledInputGroup}
            suggestedValueRadioLabel={(
              <span>
                Use suggested username:
                {' '}
                <span className="suggestion">{suggestedUsername}</span>
              </span>
          )}
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
            suggestedValueRadioLabel={(
              <span>
                Use suggested password:
                {' '}
                <span className="suggestion">{suggestedPassword}</span>
              </span>
            )}
            createOwnRadioLabel="Create your own password"
            name="htpasswd_password"
            label="Password"
            type="text"
            validate={[required, validateHTPasswdPassword]}
            isRequired
            disabled={isPending}
            helpText={`
              Must be at least 14 characters with lowercase letters, uppercase letters,
              numbers and/or symbols (ASCII-standard characters only).
            `}
          />
        </GridItem>
        <GridItem span={8}>
          <Alert
            isInline
            variant="info"
            title="Securely store your username and password"
          >
            If you lose these credentials, you will have to delete and
            recreate the HTPasswd IDP.
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
};

HTPasswdForm.defaultProps = {
  isPending: false,
};

export default HTPasswdForm;
