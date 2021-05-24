import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required } from '../../../../../../../common/validators';

function IDPBasicFields({ isPending }) {
  return (
    <>
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name="client_id"
          label="Client ID"
          type="text"
          validate={required}
          isRequired
          disabled={isPending}
        />
      </GridItem>
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name="client_secret"
          label="Client secret"
          type="password"
          validate={required}
          isRequired
          disabled={isPending}
        />
      </GridItem>
    </>
  );
}

IDPBasicFields.propTypes = {
  isPending: PropTypes.bool,
};

IDPBasicFields.defaultProps = {
  isPending: false,
};

export default IDPBasicFields;
