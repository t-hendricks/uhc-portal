import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import TagsInput from 'react-tagsinput';

import 'react-tagsinput/react-tagsinput.css';
import './ReduxFormTagsInput.scss';

class ReduxFormTagsInput extends Component {
  handleLabelsChange = (tags) => {
    const { input } = this.props;
    input.onChange(tags);
  };

  render() {
    const {
      input,
      meta: { error, dirty },
      tags,
      inputPlaceholder = 'Add a tag',
    } = this.props;

    const renderTag = ({ tag, key, onRemove, getTagDisplayValue }) => (
      <span className="pf-c-label pf-m-blue" key={key}>
        <span className="pf-c-label__content">{getTagDisplayValue(tag)}</span>
        &nbsp;
        <Button variant="plain" aria-label="remove-label" onClick={() => onRemove(key)}>
          <TimesIcon />
        </Button>
      </span>
    );

    return (
      <>
        <TagsInput
          value={tags}
          onChange={this.handleLabelsChange}
          renderTag={renderTag}
          inputProps={{ placeholder: inputPlaceholder }}
          {...input}
        />
        {dirty && error && <div className="pf-c-form__helper-text pf-m-error">{error}</div>}
      </>
    );
  }
}

ReduxFormTagsInput.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string,
    dirty: PropTypes.bool,
  }),
  tags: PropTypes.array,
  inputPlaceholder: PropTypes.string,
};

export default ReduxFormTagsInput;
