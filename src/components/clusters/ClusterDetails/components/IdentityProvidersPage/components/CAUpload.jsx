import React from 'react';

import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  InputGroup,
  TextArea,
  Button,
  InputGroupItem,
} from '@patternfly/react-core';

import { FormGroupHelperText } from '~/components/common/FormGroupHelperText';
import PopoverHint from '../../../../../common/PopoverHint';

import './CAUpload.scss';

export const MAX_FILE_SIZE = 4000000; // 4MB

export const ACCEPT = {
  'text/plain': ['.pem', '.crt', '.ca', '.cert'],
  'application/x-pem-file': ['.pem'],
  'application/x-x509-ca-cert': ['.crt', '.ca', '.cert'],
};

// To be used inside redux-form Field component.
class CAUpload extends React.Component {
  state = {
    fileName: '',
    errorMessage: '',
    certValue: '',
    showCAText: false,
  };

  componentDidMount() {
    const { certValue } = this.props;
    if (certValue && certValue !== '') {
      this.setState({ showCAText: true, certValue });
    }
  }

  fileUpload = (event) => {
    const { input } = this.props;
    const file = event.target.files[0];
    if (file.size > MAX_FILE_SIZE) {
      this.setState({ errorMessage: 'Maximum file size exceeded. File size limit is 4MB' });
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          fileName: file.name,
          errorMessage: '',
          certValue: reader.result,
          showCAText: true,
        });
        input.onChange(reader.result);
      };
      reader.readAsText(file, 'UTF-8');
    }
  };

  // This method updates the value to space if the user removes the CA value
  // When the user clears the CA value redux form removes the field from value
  // state and in order to differentiate whether the user did not have the value or
  // whether they cleared it in the edit screen we store ' '(space) in the value and
  // trim it when sending it to backend
  updateCertificateValue = (value) => {
    const { input } = this.props;
    input.onChange(value || ' ');
    this.setState({ fileName: '', certValue: value });
  };

  revealValue(status) {
    this.setState({ showCAText: status });
  }

  render() {
    const { label, helpText, extendedHelpText, isRequired, input, isDisabled } = this.props;
    const { errorMessage, fileName, certValue, showCAText } = this.state;

    const baseButtonClass = 'pf-v5-c-button pf-m-tertiary co-btn-file';
    const buttonClass = isDisabled ? `${baseButtonClass} pf-m-disabled` : baseButtonClass;
    const shouldShowCAText = !isDisabled && certValue !== '' && showCAText;

    return (
      <FormGroup className="ca-upload" fieldId={input.name} label={label} isRequired={isRequired}>
        {extendedHelpText && <PopoverHint hint={extendedHelpText} />}
        <InputGroup>
          <InputGroupItem isFill>
            <TextInput
              value={fileName}
              isRequired={isRequired}
              id={input.name}
              name={input.name}
              readOnlyVariant="default"
            />
          </InputGroupItem>
          <InputGroupItem>
            <span className={buttonClass}>
              <input type="file" onChange={this.fileUpload} disabled={isDisabled} accept={ACCEPT} />
              Browse&hellip;
            </span>
          </InputGroupItem>
        </InputGroup>

        {shouldShowCAText ? (
          <>
            <Button variant="link" onClick={() => this.revealValue(false)}>
              Hide
            </Button>

            <TextArea
              value={certValue}
              id={`${input.name}_text`}
              name={`${input.name}_text`}
              onChange={(_event, value) => this.updateCertificateValue(value)}
              className="ca-textarea"
            />
          </>
        ) : (
          <>
            <Button
              variant="link"
              onClick={() => this.revealValue(true)}
              isDisabled={certValue === '' || isDisabled}
            >
              Reveal
            </Button>
          </>
        )}

        <FormGroupHelperText touched error={errorMessage}>
          {helpText}
        </FormGroupHelperText>
      </FormGroup>
    );
  }
}
CAUpload.defaultProps = {
  helpText: '',
  isRequired: false,
};
CAUpload.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  extendedHelpText: PropTypes.string,
  isDisabled: PropTypes.bool,
  // props passed by redux-form
  // collection of redux-form callbacks to be destructured into an html input element
  input: PropTypes.object.isRequired,
  // redux-form metadata like error or active states
  // is this a required field?
  isRequired: PropTypes.bool,
  certValue: PropTypes.string,
};

export default CAUpload;
