import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  TextInput,
  InputGroup,
} from '@patternfly/react-core';
import PopoverHint from '../../../../../common/PopoverHint';

const MAX_FILE_SIZE = 4000000; // 4MB

// To be used inside redux-form Field component.
class CAUpload extends React.Component {
  state = {
    fileName: '',
    errorMessage: '',
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
        });
        input.onChange(reader.result);
      };
      reader.readAsText(file, 'UTF-8');
    }
  }

  render() {
    const {
      label,
      helpText,
      extendedHelpText,
      isRequired,
      input,
      isDisabled,
    } = this.props;
    const { errorMessage, fileName } = this.state;


    return (
      <FormGroup
        className="ca-upload"
        fieldId={input.name}
        isValid={!!errorMessage}
        label={label}
        helperText={helpText}
        helperTextInvalid={errorMessage}
        isRequired={isRequired}
      >
        { extendedHelpText && (
          <PopoverHint hint={extendedHelpText} />
        )}
        <InputGroup>
          <TextInput
            value={fileName}
            isRequired={isRequired}
            id={input.name}
            name={input.name}
            isReadOnly
          />
          <span className="pf-c-button pf-m-tertiary co-btn-file">
            <input
              type="file"
              onChange={this.fileUpload}
              disabled={isDisabled}
              accept=".pem,.crt,.ca,.cert,application/x-pem-file,application/x-x509-ca-cert,text/plain"
            />
            Browse&hellip;
          </span>
        </InputGroup>
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
};

export default CAUpload;
