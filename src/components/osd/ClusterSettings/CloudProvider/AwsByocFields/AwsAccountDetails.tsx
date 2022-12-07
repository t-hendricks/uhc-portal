import React from 'react';

import { Grid, GridItem, Alert, Title, Flex } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { awsNumericAccountID, required } from '~/common/validators';
import links from '~/common/installLinks.mjs';
import {
  billingModelConstants,
  constants,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { TextInputField, CheckboxField } from '~/components/osd/common/form';
import InstructionCommand from '~/components/common/InstructionCommand';
import ExternalLink from '~/components/common/ExternalLink';
import { FieldId } from '~/components/osd/constants';

export const AwsAccountDetails = () => {
  const { ccsCredentialsValidity } = useGlobalState((state) => state.ccsInquiries);
  const { pending: isValidating } = ccsCredentialsValidity;

  return (
    <Grid hasGutter md={6}>
      <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsLg' }}>
        <GridItem>
          <TextInputField
            name={FieldId.AccountId}
            label="AWS account ID"
            validate={awsNumericAccountID}
            isDisabled={isValidating}
            tooltip={
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
          />
        </GridItem>

        <GridItem>
          <Title headingLevel="h4">AWS IAM user credentials</Title>
        </GridItem>

        <GridItem>
          <Alert
            className="bottom-alert pf-u-mt-0"
            variant="warning"
            title={billingModelConstants.awsCredentialsWarning}
            isInline
          />
        </GridItem>

        <GridItem>
          <TextInputField
            name={FieldId.AccessKeyId}
            label="AWS access key ID"
            validate={required}
            isDisabled={isValidating}
            helperText={isValidating ? 'Validating...' : ''}
          />
        </GridItem>

        <GridItem>
          <TextInputField
            name={FieldId.SecretAccessKey}
            label="AWS secret access key"
            validate={required}
            isDisabled={isValidating}
            helperText={isValidating ? 'Validating...' : ''}
            isPassword
          />
        </GridItem>

        <GridItem>
          <CheckboxField
            name={FieldId.DisableScpChecks}
            label="Bypass AWS service control policy (SCP) checks"
            tooltip={constants.bypassSCPChecksHint}
          />
        </GridItem>
      </Flex>
    </Grid>
  );
};
