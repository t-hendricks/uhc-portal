import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function LDAPForm({ createIDPResponse }) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="bind_dn"
        label="Bind DN"
        type="text"
        placeholder="Bind DN"
        disabled={createIDPResponse.pending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="bind_password"
        label="Bind Password"
        type="text"
        placeholder="Bind Password"
        disabled={createIDPResponse.pending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="ldap_ca"
        label="CA"
        type="text"
        placeholder="CA"
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
