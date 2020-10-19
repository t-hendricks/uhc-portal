import React from 'react';
import PropTypes from 'prop-types';
import { FileUpload, FormGroup } from '@patternfly/react-core';

class ReduxFileUpload extends React.Component {
  state = {
    value: null,
    filename: '',
  };

  handleFileChange = (value, filename, e) => {
    const { input } = this.props;
    this.setState({ value, filename });
    input.onChange(e, value);
  }

  render() {
    const {
      helpText,
      meta: { error, dirty, touched },
      input,
      isRequired,
      label,
    } = this.props;
    const {
      value,
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
        isRequired={isRequired}
      >
        <FileUpload
          id={input.name}
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
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
};

export default ReduxFileUpload;
