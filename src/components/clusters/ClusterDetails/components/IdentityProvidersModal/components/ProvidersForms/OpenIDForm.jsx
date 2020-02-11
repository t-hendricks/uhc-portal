import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import CAUpload from '../CAUpload';

function OpenIDForm({ isPending }) {
  return (
    <>
      <Field
        component={CAUpload}
        name="openid_ca"
        label="CA File"
        helpText="PEM encoded certificate bundle to use to validate server certificates for the configured URL"
        isDisabled={isPending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_extra_scopes"
        label="Additional Scopes"
        type="text"
        placeholder="comma separated, example: scope1, scope2"
        disabled={isPending}
      />
    </>
  );
}

OpenIDForm.propTypes = {
  isPending: PropTypes.bool,
};

OpenIDForm.defaultProps = {
  isPending: false,
};

export default OpenIDForm;
