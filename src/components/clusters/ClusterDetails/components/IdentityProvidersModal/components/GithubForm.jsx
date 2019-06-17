import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function GithubForm({
  createIDPResponse,
}) {
  return (
    <React.Fragment>
      <Field
        component={ReduxVerticalFormGroup}
        name="hostname"
        label="Hostname"
        type="text"
        placeholder="hostname"
        disabled={createIDPResponse.pending}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="github_ca"
        label="CA"
        type="text"
        placeholder="CA"
        helpText="PEM encoded certificate bundle to use to validate server certificates for the configured URL"
        disabled={createIDPResponse.pending}
        className="ca-textarea"
        componentClass="textarea"
        spellcheck="false"
      />

    </React.Fragment>

  );
}

GithubForm.propTypes = {
  createIDPResponse: PropTypes.object,
};

GithubForm.defaultProps = {
  createIDPResponse: {},
};

export default GithubForm;
