// RouterShardInputForm shows a selection of router shard schemes for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../common/ReduxVerticalFormGroup';

function RouterShardSchemeInputComboBox(props) {
  return (
    <select {...props}>
      <option value="" key="">- Please select -</option>
      <option value="internal" key="internal">Internal</option>
      <option value="internet-facing" key="internet-facing">External</option>
    </select>
  );
}

function RouterShardInputForm(props) {
  const { name, disabled } = props;
  return (
    <div className="form-inline">
      <Field
        component={ReduxVerticalFormGroup}
        name={`${name}.label`}
        label="Label"
        type="text"
        disabled={disabled}
      />
      <Field
        component={ReduxVerticalFormGroup}
        componentClass={RouterShardSchemeInputComboBox}
        name={`${name}.scheme`}
        label="Scheme"
        disabled={disabled}
      />
    </div>
  );
}

RouterShardInputForm.propTypes = {
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default RouterShardInputForm;
