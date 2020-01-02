import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  FormGroup,
  GridItem,
} from '@patternfly/react-core';

import BillingModelRadioButtons from './BillingModelRadioButtons';

function BillingModelFields({
  hasBYOCquota, hasStandardQuota, openModal, toggleBYOCFields, byocSelected = false,
}) {
  return (
    <GridItem span={9}>
      <FormGroup
        isRequired
        fieldId="billing_model"
      >
        <Field
          component={BillingModelRadioButtons}
          name="byoc"
          hasBYOCquota={hasBYOCquota}
          hasStandardQuota={hasStandardQuota}
          byocSelected={byocSelected}
          openModal={openModal}
          onChange={toggleBYOCFields}
        />
      </FormGroup>
    </GridItem>
  );
}

BillingModelFields.propTypes = {
  hasBYOCquota: PropTypes.bool.isRequired,
  hasStandardQuota: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  toggleBYOCFields: PropTypes.func.isRequired,
  byocSelected: PropTypes.bool,
};


export default BillingModelFields;
