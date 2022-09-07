import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, FormSelect, FormSelectOption,
} from '@patternfly/react-core';

import ErrorBox from './ErrorBox';

/**
 * Generic select field whose options are fetched dynamically, and might depend on other fields.
 * Concrete behavior to be injected via props.
 */
class DynamicSelect extends React.Component {
  componentDidMount() {
    this.loadIfNeeded();
    if (this.currentValueIrrelevant()) {
      const { input } = this.props;
      input.onChange('');
    }
  }

  componentDidUpdate() {
    this.loadIfNeeded();
    if (this.currentValueIrrelevant()) {
      const { input } = this.props;
      input.onChange('');
    }
  }

  loadIfNeeded = () => {
    const {
      hasDependencies,
      matchesDependencies,
      requestStatus,
      loadData,
    } = this.props;
    if (hasDependencies && !matchesDependencies && !requestStatus.pending) {
      loadData();
    }
  }

  currentValueIrrelevant = () => {
    const {
      hasDependencies, matchesDependencies, requestStatus, items, input,
    } = this.props;
    if (!input.value) {
      // Blank/placeholder always legitimate.
      return false;
    }
    if (!hasDependencies) {
      // Can't make request.
      return true;
    }
    if (matchesDependencies && requestStatus.fulfilled) {
      // Made request and current value is no longer valid.
      return !items.includes(input.value);
    }
    return false;
  }

  render() {
    const {
      requestStatus,
      items,
      matchesDependencies,
      meta,
      input,
      isRequired,
      label,
      labelIcon,
      helperText,
      placeholder,
      emptyPlaceholder,
      noDependenciesPlaceholder,
      requestErrorTitle,
    } = this.props;
    const show = matchesDependencies && requestStatus.fulfilled;

    let options;
    if (show) {
      if (items.length > 0) {
        options = (
          <>
            <FormSelectOption isDisabled isPlaceholder value="" label={placeholder} />
            {items.map(item => (
              <FormSelectOption key={item} value={item} label={item} />
            ))}
          </>
        );
      } else {
        options = (
          <FormSelectOption isDisabled isPlaceholder value="" label={emptyPlaceholder} />
        );
      }
    } else if (requestStatus.pending) {
      options = (
        <FormSelectOption isDisabled value="" label="Loading..." />
      );
    } else {
      options = (
        <FormSelectOption isDisabled value="" label={noDependenciesPlaceholder} />
      );
    }

    // Prevent FormSelect from picking wrong option when valid options changed.
    // https://github.com/patternfly/patternfly-react/issues/5687
    const value = this.currentValueIrrelevant() ? '' : input.value;

    return (
      <FormGroup
        label={label}
        labelIcon={labelIcon}
        validated={meta.touched && meta.invalid ? 'error' : 'default'}
        helperText={helperText}
        helperTextInvalid={meta.error}
        fieldId={input.name}
        isRequired={isRequired}
      >
        {matchesDependencies && requestStatus.error && (
          <ErrorBox message={requestErrorTitle} response={requestStatus} />
        )}
        <FormSelect
          aria-label={label}
          isDisabled={!(show && items.length > 0)}
          {...input}
          value={value}
        >
          {options}
        </FormSelect>
      </FormGroup>
    );
  }
}
DynamicSelect.propTypes = {
  input: PropTypes.object.isRequired,
  // redux-form metadata like error or active states
  meta: PropTypes.object.isRequired,
  isRequired: PropTypes.bool,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.node,
  helperText: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  emptyPlaceholder: PropTypes.string.isRequired,
  noDependenciesPlaceholder: PropTypes.string,
  requestErrorTitle: PropTypes.string.isRequired,
  hasDependencies: PropTypes.bool.isRequired,
  matchesDependencies: PropTypes.bool.isRequired,
  loadData: PropTypes.func.isRequired,
  requestStatus: PropTypes.shape({
    pending: PropTypes.bool.isRequired,
    fulfilled: PropTypes.bool.isRequired,
    error: PropTypes.object,
  }).isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DynamicSelect;
