// RouterShardInputForm shows a selection of router shard schemes for installing a cluster.
// it is meant to be used in a redux-form <Field> and expects an onChange callback.

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  FormGroup,
  HelpBlock,
  OverlayTrigger,
  Tooltip,
} from 'patternfly-react';
import {
  Field,
  FormSection,
  clearFields,
  change,
} from 'redux-form';
import ReduxVerticalFormGroup from '../../../common/ReduxVerticalFormGroup';

function RouterShardSchemeInputComboBox(props) {
  return (
    <OverlayTrigger overlay={<Tooltip id="router-shard-scheme-constraint-tooltip">Only external routes are currently supported</Tooltip>}>
      <select {...props} readOnly>
        <option value="" key="">- Please select -</option>
        <option value="internal" key="internal">Internal</option>
        <option value="internet-facing" key="internet-facing">External</option>
      </select>
    </OverlayTrigger>
  );
}

function RouterShardInputForm(props) {
  const {
    input: { name, value },
    meta: {
      dispatch,
      error,
      form,
      touched,
    },
    ...extraProps // any extra props not specified above
  } = props;

  // Force external routes until upstream 4.x clusters support them
  const forceExternal = (event) => {
    dispatch(change(form, `${name}.scheme`, event.target.value ? 'internet-facing' : null));
  };

  const clearForm = () => {
    dispatch(change(form, `${name}.label`, null));
    dispatch(change(form, `${name}.scheme`, null));
    dispatch(clearFields(form, false, false, `${name}.label`));
    dispatch(clearFields(form, false, false, `${name}.scheme`));
  };

  return (
    <FormGroup controlId={name} validationState={touched && error ? 'error' : null}>
      <FormSection className="form-inline" name={name}>
        <Field
          component={ReduxVerticalFormGroup}
          name="label"
          label="Label"
          type="text"
          onChange={forceExternal}
          {...extraProps}
        />
        <Field
          component={ReduxVerticalFormGroup}
          componentClass={RouterShardSchemeInputComboBox}
          name="scheme"
          label="Scheme"
          {...extraProps}
        />
        { (value.label || value.scheme) && <Button name="clear-button" bsStyle="default" bsSize="xsmall" onClick={clearForm}>Clear</Button> }
        { touched && error && <HelpBlock>{ error }</HelpBlock> }
      </FormSection>
    </FormGroup>
  );
}

RouterShardInputForm.propTypes = {
  // name: PropTypes.object.isRequired,
  // props passed by redux-form
  // collection of redux-form callbacks to be destructured into an html input element
  input: PropTypes.object.isRequired,
  // redux-form metadata like error or active states
  meta: PropTypes.object.isRequired,
  // plus other props passed from the <Field> component to the control (extraProps, incl. children)…
};

export default RouterShardInputForm;
