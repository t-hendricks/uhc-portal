import React from 'react';
import { GridItem, Alert, HelperText, HelperTextItem } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  atLeastOneRequired,
  required,
  validateHTPasswdPassword,
  validateHTPasswdUsername,
} from '../../../../../../../common/validators';
import {
  ReduxFieldArray,
  RenderCompoundArrayFields,
} from '../../../../../../../components/common/ReduxFormComponents';

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

// https://issues.redhat.com/browse/HAC-2011
const HTPasswdForm = ({
  isPending,
  // isEditForm,
  // idpEdited,
  // change,
  // clearFields,
  HtPasswdErrors,
}) => {
  const getHelpText = (index) => {
    const passwordErrors = HtPasswdErrors?.[index]?.password;
    return <HelpTextPassword passwordErrors={passwordErrors} />;
  };

  const getAutocompleteText = (value) => (
    <div>
      Use suggested password:
      <br />
      <b>{`${value}`}</b>
    </div>
  );

  return (
    <>
      <ReduxFieldArray
        fieldName="users"
        fieldSpan={11}
        component={RenderCompoundArrayFields}
        compoundFields={[
          {
            name: 'username',
            label: 'Username',
            type: 'text',
            isRequired: true,
            getPlaceholderText: (index) => `Unique username ${index + 1}`,
            validate: [required, validateHTPasswdUsername],
          },
          {
            name: 'password',
            label: 'Password',
            type: 'password',
            isRequired: true,
            getHelpText,
            getAutocompleteValue: generatePassword,
            getAutocompleteText,
            validate: validateHTPasswdPassword,
          },
        ]}
        label="Users"
        helpText="Unique names of the users within the cluster. A username must not contain /, :, or %."
        isRequired
        disabled={isPending}
        validate={atLeastOneRequired(
          'users',
          (field) => !field?.username || field.username.trim() === '',
        )}
      />
      <GridItem span={11}>
        <Alert isInline variant="info" title="Securely store your username and password">
          If you lose these credentials, you will have to delete and recreate the cluster admin
          user.
        </Alert>
      </GridItem>
    </>
  );
};
// class HTPasswdForm extends React.Component {
//   state = {
//     useSuggestedUsername: true,
//     suggestedUsername: `admin-${randAlphanumString(6)}`,
//     useSuggestedPassword: true,
//     suggestedPassword: generatePassword(),
//   };

//   componentDidMount() {
//     const { change } = this.props;
//     const { suggestedUsername, suggestedPassword } = this.state;
//     change('htpasswd_password', suggestedPassword);
//     change('htpasswd_username', suggestedUsername);
//   }

//   componentDidUpdate(prevProps, prevState) {
//     const { clearFields } = this.props;
//     const { useSuggestedPassword } = this.state;
//     // artificially reset the uncontrolled password confirmation field once it's hidden
//     if (useSuggestedPassword && !prevState.useSuggestedPassword) {
//       clearFields(false, false, 'htpasswd_password_confirmation');
//     }
//   }

//   // radioControlledInputGroup = ({
//   //   suggestedValueRadioLabel,
//   //   createOwnRadioLabel,
//   //   label,
//   //   helpText,
//   //   input,
//   //   isPending,
//   //   ...extraProps
//   // }) => {
//   //   const { useSuggestedPassword, useSuggestedUsername, suggestedPassword, suggestedUsername } =
//   //     this.state;

//   //   const isPassword = extraProps.type === 'password';
//   //   const suggestedValue = isPassword ? suggestedPassword : suggestedUsername;
//   //   const useSuggestionIsChecked = isPassword ? useSuggestedPassword : useSuggestedUsername;

//   //   const validatePasswordsMatch = useCallback(
//   //     (value, allValues) =>
//   //       allValues[input.name] !== value ? 'Passwords do not match' : undefined,
//   //     [input.name],
//   //   );

//   //   return (
//   //     <>
//   //       <Stack>
//   //         <StackItem className="pf-c-form__group-label">
//   //           <p className="pf-c-form__label-text field-label">
//   //             {label}
//   //             <span className="pf-c-form__label-required">*</span>
//   //           </p>
//   //         </StackItem>
//   //         <StackItem className="pf-u-mb-sm">
//   //           <Radio
//   //             label={suggestedValueRadioLabel}
//   //             id={`use-suggested-${label.toLowerCase()}`}
//   //             isChecked={useSuggestionIsChecked}
//   //             onChange={() => {
//   //               this.setState({
//   //                 [isPassword ? 'useSuggestedPassword' : 'useSuggestedUsername']: true,
//   //               });
//   //               input.onChange(suggestedValue);
//   //             }}
//   //           />
//   //         </StackItem>
//   //         <StackItem className="pf-u-mb-sm">
//   //           <Radio
//   //             label={createOwnRadioLabel}
//   //             id={`create-own-${label.toLowerCase()}`}
//   //             isChecked={!useSuggestionIsChecked}
//   //             onChange={() => {
//   //               this.setState({
//   //                 [isPassword ? 'useSuggestedPassword' : 'useSuggestedUsername']: false,
//   //               });
//   //               input.onChange('');
//   //             }}
//   //           />
//   //         </StackItem>
//   //         {!useSuggestionIsChecked && (
//   //           <StackItem className="pf-u-mb-sm">
//   //             <ReduxVerticalFormGroup
//   //               name={input.name}
//   //               disabled={isPending}
//   //               validate={required}
//   //               helpText={helpText}
//   //               input={input}
//   //               {...extraProps}
//   //             />
//   //           </StackItem>
//   //         )}
//   //         {isPassword && !useSuggestedPassword && (
//   //           <StackItem className="pf-u-mt-sm pf-u-mb-sm">
//   //             <Field
//   //               component={ReduxVerticalFormGroup}
//   //               name={`${input.name}_confirmation`}
//   //               label="Confirm password"
//   //               type="password"
//   //               disabled={isPending}
//   //               isRequired={extraProps.isRequired}
//   //               validate={[required, validatePasswordsMatch]}
//   //             />
//   //           </StackItem>
//   //         )}
//   //       </Stack>
//   //     </>
//   //   );
//   // };

//   render() {
//     const { isPending, HTPasswdPasswordErrors } = this.props;
//     const { suggestedUsername, suggestedPassword } = this.state;

//     return (
//       <>
//         <GridItem span={8} className="htpasswd-form">
//           <Field
//             component={this.radioControlledInputGroup}
//             suggestedValueRadioLabel={
//               <span>
//                 Use suggested username: <span className="suggestion">{suggestedUsername}</span>
//               </span>
//             }
//             createOwnRadioLabel="Create your own username"
//             name="htpasswd_username"
//             label="Username"
//             type="text"
//             validate={[required, validateHTPasswdUsername]}
//             isRequired
//             disabled={isPending}
//             helpText="Unique name of the user within the cluster. Username must not contain /, :, or %."
//           />
//         </GridItem>
//         <GridItem span={8} className="htpasswd-form">
//           <Field
//             component={this.radioControlledInputGroup}
//             hasOtherValidation
//             suggestedValueRadioLabel={
//               <span>
//                 Use suggested password: <span className="suggestion">{suggestedPassword}</span>
//               </span>
//             }
//             createOwnRadioLabel="Create your own password"
//             name="htpasswd_password"
//             label="Password"
//             type="password"
//             validate={validateHTPasswdPassword}
//             isRequired
//             disabled={isPending}
//             helpText={<HelpTextPassword passwordErrors={HTPasswdPasswordErrors} />}
//           />
//         </GridItem>
//         <br />
//         <NewHTPasswdForm {...this.props} />
//       </>
//     );
//   }
// }

// HTPasswdForm.propTypes = {
//   isPending: PropTypes.bool,
//   change: PropTypes.func,
//   clearFields: PropTypes.func,
//   input: PropTypes.object,
//   HTPasswdPasswordErrors: {
//     emptyPassword: PropTypes.bool,
//     baseRequirements: PropTypes.bool,
//     uppercase: PropTypes.bool,
//     lowercase: PropTypes.bool,
//     numbers: PropTypes.bool,
//   },
// };

// HTPasswdForm.defaultProps = {
//   isPending: false,
// };

export default HTPasswdForm;
