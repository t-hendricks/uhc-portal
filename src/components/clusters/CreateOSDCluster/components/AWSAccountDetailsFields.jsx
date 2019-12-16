import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { GridItem, Alert } from '@patternfly/react-core';
import ReduxVerticalFormGroup from '../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import { billingModelConstants } from '../CreateOSDClusterHelper';
import { required } from '../../../../common/validators';

function AWSAccountDetailsFields(props) {
  const { pending } = props;

  return (
    <React.Fragment>
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="access_key_id"
          label="AWS account ID"
          type="text"
          validate={required}
          disabled={pending}
          extendedHelpText="AWS accound ID"
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={4}>
        <h4>AWS IAM user credentials</h4>
      </GridItem>
      <GridItem span={8} />
      <GridItem span={8}>
        <Alert variant="warning" title={billingModelConstants.awsCredentialsWarning} isInline />
      </GridItem>
      <GridItem span={4} />
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="account_id"
          label="AWS access key ID"
          type="text"
          validate={required}
          disabled={pending}
          extendedHelpText="AWS access key ID"
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
          extendedHelpText="AWS secret access key"
        />
      </GridItem>
    </React.Fragment>
  );
}

AWSAccountDetailsFields.propTypes = {
  pending: PropTypes.bool,
};

export default AWSAccountDetailsFields;
