import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../../common/validators';

function BasicFields({ createIDPResponse }) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="client_id"
        label="Client ID"
        type="text"
        placeholder="Client ID"
        validate={validators.required}
        disabled={createIDPResponse.pending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="client_secret"
        label="Client Secret"
        type="password"
        placeholder="Client Secret"
        validate={validators.required}
        disabled={createIDPResponse.pending}
      />
    </React.Fragment>
  );
}

BasicFields.propTypes = {
  createIDPResponse: PropTypes.object,
};

BasicFields.defaultProps = {
  createIDPResponse: {},
};

export default BasicFields;
