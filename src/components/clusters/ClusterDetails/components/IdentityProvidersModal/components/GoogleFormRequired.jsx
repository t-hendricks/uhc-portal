import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import BasicFields from './BasicFields';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import validators from '../../../../../../common/validators';

function GoogleFormRequired({ createIDPResponse }) {
  return (
    <React.Fragment>
      <BasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="hosted_domain"
        label="Hosted Domain"
        type="text"
        placeholder="Hosted Domain"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
    </React.Fragment>
  );
}

GoogleFormRequired.propTypes = {
  createIDPResponse: PropTypes.object,
};

GoogleFormRequired.defaultProps = {
  createIDPResponse: {},
};

export default GoogleFormRequired;
