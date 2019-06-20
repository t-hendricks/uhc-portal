import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import BasicFields from './BasicFields';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import { required } from '../../../../../../../common/validators';

function GoogleFormRequired({ isPending }) {
  return (
    <React.Fragment>
      <BasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="hosted_domain"
        label="Hosted Domain"
        type="text"
        placeholder="Hosted Domain"
        disabled={isPending}
        validate={required}
      />
    </React.Fragment>
  );
}

GoogleFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

GoogleFormRequired.defaultProps = {
  isPending: false,
};

export default GoogleFormRequired;
