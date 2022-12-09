import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { GridItem, Alert, Title, Flex } from '@patternfly/react-core';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { billingModelConstants, constants } from '../CreateOSDFormConstants';
import { required, awsNumericAccountID } from '../../../../../common/validators';
import ExternalLink from '../../../../common/ExternalLink';
import ReduxCheckbox from '../../../../common/ReduxFormComponents/ReduxCheckbox';
import InstructionCommand from '../../../../common/InstructionCommand';
import links from '../../../../../common/installLinks.mjs';

function AWSAccountDetailsSection({ pending, isWizard, isValidating }) {
  return (
    <Flex direction={{ default: 'column' }}>
      <GridItem md={6}>
        <Field
          component={ReduxVerticalFormGroup}
          name="account_id"
          label="AWS account ID"
          type="text"
          validate={awsNumericAccountID}
          disabled={pending}
          extendedHelpText={
            <>
              <p>
                Find your 12-digit AWS account ID in the AWS console or by running this command in
                the AWS CLI:
              </p>
              <br />
              <InstructionCommand textAriaLabel="Copyable AWS account ID command">
                $ aws sts get-caller-identity
              </InstructionCommand>
              <br />
              <ExternalLink href={links.FINDING_AWS_ACCOUNT_IDENTIFIERS}>
                Finding your AWS account ID
              </ExternalLink>
            </>
          }
          isRequired
          data-hj-suppress
        />
      </GridItem>
      <GridItem md={6} />
      <GridItem md={6}>
        <Title headingLevel="h4">AWS IAM user credentials</Title>
      </GridItem>
      {!isWizard && (
        <GridItem>
          <Alert
            className="bottom-alert"
            variant="warning"
            title={billingModelConstants.awsCredentialsWarning}
            isInline
          />
        </GridItem>
      )}
      <GridItem md={6}>
        <Field
          component={ReduxVerticalFormGroup}
          name="access_key_id"
          label="AWS access key ID"
          type="text"
          validate={required}
          disabled={pending || isValidating}
          helpText={isValidating ? 'Validating...' : ''}
          isRequired
          data-hj-suppress
        />
      </GridItem>
      <GridItem md={6} />
      <GridItem md={6}>
        <Field
          component={ReduxVerticalFormGroup}
          name="secret_access_key"
          label="AWS secret access key"
          type="password"
          validate={required}
          disabled={pending || isValidating}
          helpText={isValidating ? 'Validating...' : ''}
          isRequired
        />
      </GridItem>
      <GridItem md={6} />
      <GridItem>
        <Field
          component={ReduxCheckbox}
          name="disable_scp_checks"
          label="Bypass AWS service control policy (SCP) checks"
          extendedHelpText={constants.bypassSCPChecksHint}
        />
      </GridItem>
    </Flex>
  );
}

AWSAccountDetailsSection.propTypes = {
  isWizard: PropTypes.bool,
  pending: PropTypes.bool,
  isValidating: PropTypes.bool,
};

export default AWSAccountDetailsSection;
