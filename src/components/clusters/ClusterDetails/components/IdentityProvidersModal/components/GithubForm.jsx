import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GithubForm({
  createIDPResponse,
}) {
  return (
    <Field
      component={ReduxVerticalFormGroup}
      name="hostname"
      label="Hostname"
      type="text"
      placeholder="hostname"
      disabled={createIDPResponse.pending}
    />
  );
}

GithubForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

GithubForm.defaultProps = {
  createIDPResponse: {},
};

export default GithubForm;
