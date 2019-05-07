import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import BasicFields from './BasicFields';

import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../../../../common/validators';

function OpenIDFormRequired({ createIDPResponse }) {
  return (
    <React.Fragment>
      <BasicFields />
      <h4>URLs</h4>
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_authorize"
        label="OAuth authorization URL"
        type="text"
        placeholder="OAuth authorization URL"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_token"
        label="OAuth token granting URL"
        type="text"
        placeholder="OAuth token granting URL"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_userinfo"
        label="Userinfo URL"
        type="text"
        placeholder="userInfo URL"
        disabled={createIDPResponse.pending}
      />

      <h4>Claims Mappings</h4>
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_email"
        label="Email"
        type="text"
        placeholder="comma separated, example: ***REMOVED***, ***REMOVED***"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_name"
        label="Name"
        type="text"
        placeholder="comma separated, example: 'name1, name2"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_preferred_username"
        label="Preferred Username"
        type="text"
        placeholder="comma separated, example: 'name1, name2, name3"
        disabled={createIDPResponse.pending}
        validate={validators.required}
      />
    </React.Fragment>
  );
}

OpenIDFormRequired.propTypes = {
  createIDPResponse: PropTypes.object,
};

OpenIDFormRequired.defaultProps = {
  createIDPResponse: {},
};

export default OpenIDFormRequired;
