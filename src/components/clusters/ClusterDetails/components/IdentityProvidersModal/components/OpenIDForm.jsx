import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function OpenIDForm({ createIDPResponse }) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_ca"
        label="CA"
        type="text"
        placeholder="CA"
        helpText="PEM encoded certificate bundle to use to validate server certificates for the configured URL"
        disabled={createIDPResponse.pending}
        className="ca-textarea"
        componentClass="textarea"
        spellCheck="false"
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_extra_scopes"
        label="Additional Scopes"
        type="text"
        placeholder="comma separated, example: scope1, scope2"
        disabled={createIDPResponse.pending}
      />
    </React.Fragment>
  );
}

OpenIDForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

OpenIDForm.defaultProps = {
  createIDPResponse: {},
};

export default OpenIDForm;
