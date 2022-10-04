import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import ReduxCheckbox from '~/components/common/ReduxFormComponents/ReduxCheckbox';

/* Hidden/zero-height ReduxCheckbox which must be checked/true in order to pass
   field level validation.
   Typically used as an inner-anchor to scroll to upon field level validation error
   Validation can be handled asynchronously and set programmatically via:
     Ex: change('detected_ocm_and_user_roles', false|true);
*/
const ReduxHiddenCheckbox = ({ name }) => <span className="zero-height">
      <Field
        component={ReduxCheckbox}
        name={`${name}`}
        validate={(value) => value && value === true ? undefined : ' '}
      />
    </span>

ReduxHiddenCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
};

export default ReduxHiddenCheckbox;
