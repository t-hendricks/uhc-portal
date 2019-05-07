import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import validators from '../../../../../../common/validators';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GitlabForm({ createIDPResponse }) {
  return (
    <Field
      component={ReduxVerticalFormGroup}
      name="gitlab_ca"
      label="CA"
      type="text"
      placeholder="CA"
      disabled={createIDPResponse.pending}
      validate={validators.required}
    />
  );
}

GitlabForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

GitlabForm.defaultProps = {
  createIDPResponse: {},
};

export default GitlabForm;
