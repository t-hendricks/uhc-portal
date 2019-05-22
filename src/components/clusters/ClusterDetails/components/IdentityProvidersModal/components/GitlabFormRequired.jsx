import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import BasicFields from './BasicFields';

import validators from '../../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GitlabFormRequired({ createIDPResponse }) {
  return (
    <React.Fragment>
      <BasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="url"
        label="OAuth server base URL"
        type="text"
        placeholder="url"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
    </React.Fragment>

  );
}

GitlabFormRequired.propTypes = {
  createIDPResponse: PropTypes.object,
};

GitlabFormRequired.defaultProps = {
  createIDPResponse: {},
};

export default GitlabFormRequired;
