import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { GridItem, Alert, Title } from '@patternfly/react-core';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { billingModelConstants, constants } from '../CreateOSDFormConstants';
import { required, awsNumericAccountID } from '../../../../../common/validators';
import ExternalLink from '../../../../common/ExternalLink';
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';

function AWSAccountDetailsSection({ pending, isWizard, isValidating }) {
  return (
    <>
      <GridItem sm={12} md={5} lg={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="account_id"
          label="AWS account ID"
          type="text"
          validate={awsNumericAccountID}
          disabled={pending}
          extendedHelpText={(
            <>
              The 12 digits numeric identifier of your AWS account.
              <br />
              See
              {' '}
              <ExternalLink href="https://docs.aws.amazon.com/general/latest/gr/acct-identifiers.html">AWS documentation</ExternalLink>
              {' '}
              for more details.
            </>
        )}
          isRequired
        />
      </GridItem>
      <GridItem md={7} lg={8} />
      <GridItem sm={12} md={5} lg={4}>
        <Title headingLevel="h4">AWS IAM user credentials</Title>
      </GridItem>
      <GridItem sm={12} md={10} lg={8}>
        { !isWizard && (
          <Alert className="bottom-alert" variant="warning" title={billingModelConstants.awsCredentialsWarning} isInline />
        )}
      </GridItem>
      <GridItem sm={12} md={5} lg={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="access_key_id"
          label="AWS access key ID"
          type="text"
          validate={required}
          disabled={pending || isValidating}
          helpText={isValidating && 'Validating...'}
          isRequired
        />
      </GridItem>
      <GridItem md={7} lg={8} />
      <GridItem sm={12} md={5} lg={4}>
        <Field
          component={ReduxVerticalFormGroup}
          name="secret_access_key"
          label="AWS secret access key"
          type="text"
          validate={required}
          disabled={pending || isValidating}
          helpText={isValidating && 'Validating...'}
          isRequired
        />
      </GridItem>
      <GridItem md={7} lg={8} />
      <GridItem>
        <Field
          component={ReduxCheckbox}
          name="disable_scp_checks"
          label="Bypass AWS Service Control Policy (SCP) checks"
          extendedHelpText={constants.bypassSCPChecksHint}
        />
      </GridItem>
    </>
  );
}

AWSAccountDetailsSection.propTypes = {
  isWizard: PropTypes.bool,
  pending: PropTypes.bool,
  isValidating: PropTypes.bool,
};

export default AWSAccountDetailsSection;
