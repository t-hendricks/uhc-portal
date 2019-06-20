import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import BasicFields from './BasicFields';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';

function OpenIDFormRequired({ isPending }) {
  return (
    <React.Fragment>
      <BasicFields />
      <Field
        component={ReduxVerticalFormGroup}
        name="issuer"
        label="Issuer URL"
        type="text"
        placeholder="Issuer URL"
        disabled={isPending}
        validate={required}
      />
      <h4>Claims Mappings</h4>
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_email"
        label="Email"
        type="text"
        placeholder="comma separated, example: ***REMOVED***, ***REMOVED***"
        disabled={isPending}
        validate={required}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_name"
        label="Name"
        type="text"
        placeholder="comma separated, example: 'name1, name2"
        disabled={isPending}
        validate={required}
      />
      <Field
        component={ReduxVerticalFormGroup}
        name="openid_preferred_username"
        label="Preferred Username"
        type="text"
        placeholder="comma separated, example: 'name1, name2, name3"
        disabled={isPending}
        validate={required}
      />
    </React.Fragment>
  );
}

OpenIDFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

OpenIDFormRequired.defaultProps = {
  isPending: false,
};

export default OpenIDFormRequired;
