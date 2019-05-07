import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GoogleForm({ createIDPResponse }) {
  return (
    <Field
      component={ReduxVerticalFormGroup}
      name="hosted_domain"
      label="Google App domain"
      type="text"
      placeholder="Google App domain"
      disabled={createIDPResponse.pending}
    />
  );
}

GoogleForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

GoogleForm.defaultProps = {
  createIDPResponse: {},
};

export default GoogleForm;
