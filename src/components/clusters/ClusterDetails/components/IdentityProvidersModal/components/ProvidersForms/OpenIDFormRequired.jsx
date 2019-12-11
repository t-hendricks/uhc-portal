import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import IDPBasicFields from './IDPBasicFields';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { checkOpenIDIssuer } from '../../../../../../../common/validators';

const validate = (_, allValues) => {
  if (!allValues.openid_preferred_username && !allValues.openid_name && !allValues.openid_email) {
    return 'At least one claim is required';
  }
  return undefined;
};

function OpenIDFormRequired({ isPending }) {
  return (
    <React.Fragment>
      <IDPBasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="issuer"
        label="Issuer URL"
        type="text"
        placeholder="Issuer URL"
        disabled={isPending}
        validate={checkOpenIDIssuer}
      />
      <h4>Claims Mappings</h4>
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_email"
        label="Email"
        type="text"
        disabled={isPending}
        validate={validate}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_name"
        label="Name"
        type="text"
        disabled={isPending}
        validate={validate}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_preferred_username"
        label="Preferred Username"
        type="text"
        disabled={isPending}
        validate={validate}
      />
    </React.Fragment>
  );
}

OpenIDFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

OpenIDFormRequired.defaultProps = {
  isPending: false,
};

export default OpenIDFormRequired;
