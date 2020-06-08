import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import IDPBasicFields from './IDPBasicFields';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { checkOpenIDIssuer } from '../../../../../../../common/validators';
import ReduxFieldArray from '../../../../../../common/ReduxFormComponents/ReduxFieldArray';

const validate = (_, allValues) => {
  if (!allValues.openid_preferred_username && !allValues.openid_name && !allValues.openid_email) {
    return 'At least one claim is required';
  }
  return undefined;
};

function OpenIDFormRequired({ isPending }) {
  return (
    <>
      <IDPBasicFields />
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name="issuer"
          label="Issuer URL"
          type="text"
          disabled={isPending}
          validate={checkOpenIDIssuer}
          isRequired
          helpText="The URL that the OpenID provider asserts as the Issuer Identifier. It must use the https scheme with no URL query parameters or fragment."
        />
      </GridItem>
      <GridItem span={8}>
        <h4>Claims mappings</h4>
      </GridItem>
      <ReduxFieldArray
        fieldName="openid_email"
        label="Email"
        type="text"
        placeholderText="e.g. email"
        disabled={isPending}
        helpText="The list of attributes whose values should be used as the email address."
        validate={validate}
      />

      <ReduxFieldArray
        fieldName="openid_name"
        label="Name"
        type="text"
        placeholderText="e.g. name"
        disabled={isPending}
        validate={validate}
        helpText="The list of attributes whose values should be used as the preferred username."
      />
      <ReduxFieldArray
        fieldName="openid_preferred_username"
        label="Preferred username"
        type="text"
        placeholderText="e.g. preferred_username"
        disabled={isPending}
        validate={validate}
        helpText="The list of attributes whose values should be used as the display name."
      />
    </>
  );
}

OpenIDFormRequired.propTypes = {
  isPending: PropTypes.bool,
};

OpenIDFormRequired.defaultProps = {
  isPending: false,
};

export default OpenIDFormRequired;
