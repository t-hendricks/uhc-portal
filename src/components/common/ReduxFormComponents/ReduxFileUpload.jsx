import React from 'react';
import PropTypes from 'prop-types';
import { FileUpload, FormGroup } from '@patternfly/react-core';

import PopoverHint from '../PopoverHint';

class ReduxFileUpload extends React.Component {
  state = {
    filename: '',
  };

  componentDidMount() {
    // added because the FileUpload component does not forward additional props
    // like placeholder and onBlur to the TextArea
    // https://github.com/patternfly/patternfly-react/issues/7004
    const { placeholder, input: { name } } = this.props;
    document.getElementById(name).addEventListener('blur', this.onTextAreaBlur);
    if (placeholder) {
      document.getElementById(name).setAttribute('placeholder', placeholder);
    }
  }

  componentWillUnmount() {
    const { input: { name } } = this.props;
    document.getElementById(name).removeEventListener('blur', this.onTextAreaBlur);
  }

  onTextAreaBlur = (event) => {
    const { input: { onBlur } } = this.props;
    onBlur(event);
  };

  handleFileChange = (value, _, e) => {
    const { input } = this.props;
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.setState({
          filename: file.name,
        });
        input.onChange(reader.result);
      };
      reader.readAsText(file, 'UTF-8');
    } else {
      input.onChange(value);
    }
  }

  render() {
    const {
      helpText,
      meta: { error, dirty, touched },
      input: { name, value },
      isRequired,
      label,
      extendedHelpTitle,
      extendedHelpText,
    } = this.props;
    const {
      filename,
    } = this.state;

    const helperTextInvalid = () => {
      if ((dirty || touched) && error) {
        return error;
      }
      return '';
    };

    return (
      <FormGroup
        fieldId={name}
        helperText={helpText}
        helperTextInvalid={helperTextInvalid()}
        validated={(dirty || touched) && error ? 'error' : 'default'}
        label={label}
        labelIcon={extendedHelpText && (
          <PopoverHint title={extendedHelpTitle} hint={extendedHelpText} />
        )}
        isRequired={isRequired}
      >
        <FileUpload
          allowEditingUploadedText
          isDragActive
          id={name}
          type="text"
          value={value}
          filename={filename}
          onChange={this.handleFileChange}
          validated={(dirty || touched) && error ? 'error' : 'default'}
        />
      </FormGroup>
    );
  }
}

ReduxFileUpload.defaultProps = {
  helpText: '',
  isRequired: false,
};

ReduxFileUpload.propTypes = {
  helpText: PropTypes.string,
  extendedHelpTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
};

export default ReduxFileUpload;
