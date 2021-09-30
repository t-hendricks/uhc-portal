import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { GridItem } from '@patternfly/react-core';

import ReduxVerticalFormGroup from '../../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import CAUpload from '../CAUpload';

function OpenIDForm({ isPending, isEditForm, idpEdited }) {
  return (
    <>
      <GridItem span={8}>
        <Field
          component={CAUpload}
          name="openid_ca"
          label="CA file"
          helpText="PEM encoded certificate bundle to use to validate server certificates for the configured URL"
          isDisabled={isPending}
          certValue={isEditForm ? idpEdited.open_id.ca : ''}
        />
      </GridItem>
      <GridItem span={8}>
        <Field
          component={ReduxVerticalFormGroup}
          name="openid_extra_scopes"
          label="Additional scopes"
          type="text"
          placeholder="e.g. scope1, scope2"
          disabled={isPending}
        />
      </GridItem>
    </>
  );
}

OpenIDForm.propTypes = {
  isPending: PropTypes.bool,
  isEditForm: PropTypes.bool,
  idpEdited: PropTypes.object,
};

OpenIDForm.defaultProps = {
  isPending: false,
};

export default OpenIDForm;
