import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function LDAPForm({ createIDPResponse }) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="ldap_ca"
        label="CA"
        type="text"
        placeholder="CA"
        helpText="PEM encoded certificate bundle to use to validate server certificates for the configured URL"
        disabled={createIDPResponse.pending}
        className="ca-textarea"
        componentClass="textarea"
        spellcheck="false"
      />
      <Field
        component={ReduxCheckbox}
        name="ldap_insecure"
        label="insecure"
        disabled={createIDPResponse.pending}
      />
    </React.Fragment>
  );
}

LDAPForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

LDAPForm.defaultProps = {
  createIDPResponse: {},
};

export default LDAPForm;
