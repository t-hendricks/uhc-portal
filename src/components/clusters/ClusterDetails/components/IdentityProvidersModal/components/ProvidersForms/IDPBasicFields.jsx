import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';

function IDPBasicFields({ isPending }) {
  return (
    <>
      <Field
        component={ReduxVerticalFormGroup}
        name="client_id"
        label="Client ID"
        type="text"
        validate={required}
        isRequired
        disabled={isPending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="client_secret"
        label="Client Secret"
        type="password"
        validate={required}
        isRequired
        disabled={isPending}
      />
    </>
  );
}

IDPBasicFields.propTypes = {
  isPending: PropTypes.bool,
};

IDPBasicFields.defaultProps = {
  isPending: false,
};

export default IDPBasicFields;
