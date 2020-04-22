import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { GridItem, Alert } from '@patternfly/react-core';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import { billingModelConstants } from '../CreateOSDFormConstants';
import { required } from '../../../../../common/validators';

function AWSAccountDetailsSection({ pending }) {
  return (
    <>
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="account_id"
          label="AWS account ID"
          type="text"
          validate={required}
          disabled={pending}
          isRequired
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={4}>
        <h4>AWS IAM user credentials</h4>
      </GridItem>
      <GridItem span={8} />
      <GridItem span={8}>
        <Alert className="buttom-alert" variant="warning" title={billingModelConstants.awsCredentialsWarning} isInline />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="access_key_id"
          label="AWS access key ID"
          type="text"
          validate={required}
          disabled={pending}
          isRequired
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="secret_access_key"
          label="AWS secret access key"
          type="text"
          validate={required}
          disabled={pending}
          isRequired
        />
      </GridItem>
    </>
  );
}

AWSAccountDetailsSection.propTypes = {
  pending: PropTypes.bool,
};

export default AWSAccountDetailsSection;
