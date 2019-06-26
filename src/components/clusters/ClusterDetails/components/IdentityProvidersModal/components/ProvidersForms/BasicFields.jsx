import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';

function BasicFields({ isPending }) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="client_id"
        label="Client ID"
        type="text"
        placeholder="Client ID"
        validate={required}
        disabled={isPending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="client_secret"
        label="Client Secret"
        type="password"
        placeholder="Client Secret"
        validate={required}
        disabled={isPending}
      />
    </React.Fragment>
  );
}

BasicFields.propTypes = {
  isPending: PropTypes.bool,
};

BasicFields.defaultProps = {
  isPending: false,
};

export default BasicFields;
