import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { required } from '../../../../../../../common/validators';
import IDPBasicFields from './IDPBasicFields';
import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GoogleForm({ isPending, isRequired }) {
  return (
    <>
      <IDPBasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="hosted_domain"
        label="Hosted Domain"
        type="text"
        helpText="Restrict users to a Google Apps domain"
        disabled={isPending}
        isRequired={isRequired}
        validate={isRequired ? required : null}
      />
    </>
  );
}

GoogleForm.propTypes = {
  isPending: PropTypes.bool,
  isRequired: PropTypes.bool,
};

GoogleForm.defaultProps = {
  isPending: false,
  isRequired: false,
};

export default GoogleForm;
