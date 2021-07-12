import React from 'react';
import PropTypes from 'prop-types';
import { FileUpload, FormGroup } from '@patternfly/react-core';

import PopoverHint from '../PopoverHint';

class ReduxFileUpload extends React.Component {
  state = {
    filename: '',
  };

  handleFileChange = (value, filename, e) => {
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
      this.setState({ filename });
      input.onChange(value);
    }
  }

  render() {
    const {
      helpText,
      meta: { error, dirty, touched },
      input,
      isRequired,
      label,
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
        fieldId={input.name}
        helperText={helpText}
        helperTextInvalid={helperTextInvalid()}
        validated={(dirty || touched) && error ? 'error' : 'default'}
        label={label}
        labelIcon={extendedHelpText && (<PopoverHint hint={extendedHelpText} />)}
        isRequired={isRequired}
      >
        <FileUpload
          allowEditingUploadedText
          isDragActive
          id={input.name}
          type="text"
          value={input.value}
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
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
};

export default ReduxFileUpload;
