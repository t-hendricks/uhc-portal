import React from 'react';

import { Grid, GridItem, Alert, FormGroup } from '@patternfly/react-core';

import { validateAWSKMSKeyARN } from '~/common/validators';
import ExternalLink from '~/components/common/ExternalLink';
import links from '~/common/installLinks.mjs';
import { constants } from '~/components/clusters/common/CreateOSDFormConstants';
import { FieldId } from '~/components/clusters/wizards/common/constants';
import {
  RadioGroupField,
  RadioGroupOption,
  TextInputField,
} from '~/components/clusters/wizards/form';
import { useFormState } from '~/components/clusters/wizards/hooks';

export const AWSCustomerManagedEncryption = () => {
  const {
    values: {
      [FieldId.Region]: region,
      [FieldId.CustomerManagedKey]: customerManagedKey,
      [FieldId.KmsKeyArn]: kmsKeyArn,
    },
    setFieldTouched,
  } = useFormState();

  const hasCustomerManagedKey = customerManagedKey === 'true';

  const cloudProviderLearnLink =
    'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html';

  const helpText =
    'Use a custom AWS KMS key for AWS EBS volume encryption instead of your default AWS KMS key.';

  const customerManagedKeyOptions: RadioGroupOption[] = [
    {
      value: 'false',
      label: 'Use default KMS Keys',
    },
    {
      value: 'true',
      label: 'Use custom KMS keys',
      popoverHint: helpText,
    },
  ];

  React.useEffect(() => {
    if (hasCustomerManagedKey && kmsKeyArn) {
      setFieldTouched(FieldId.KmsKeyArn, true, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid hasGutter>
      <GridItem>
        <FormGroup
          fieldId={FieldId.CustomerManagedKey}
          id="customerManagedKey"
          label="Encryption Keys"
        >
          <div className="pf-v5-u-font-size-sm pf-v5-u-pb-md">
            The cloud storage for your cluster is encrypted at rest.{' '}
            <ExternalLink href={cloudProviderLearnLink}>Learn more</ExternalLink>
          </div>

          <RadioGroupField
            name={FieldId.CustomerManagedKey}
            options={customerManagedKeyOptions}
            direction="row"
            isRequired
          />
        </FormGroup>
      </GridItem>

      {hasCustomerManagedKey && (
        <GridItem>
          <TextInputField
            name={FieldId.KmsKeyArn}
            label="Key ARN"
            validate={(value) => validateAWSKMSKeyARN(value, region)}
            helperText={!kmsKeyArn ? 'Provide a custom key ARN' : ''}
            tooltip={
              <>
                <p className="pf-v5-u-mb-sm">{constants.awsKeyARN}</p>
                <ExternalLink href={links.AWS_FINDING_KEY_ARN}>
                  Finding the key ID and ARN
                </ExternalLink>
              </>
            }
          />
          <GridItem md={6}>
            <Alert
              className="pf-v5-u-mt-sm"
              isInline
              isLiveRegion
              variant="info"
              title="If you delete the ARN key, the cluster will no longer be available."
            />
          </GridItem>
        </GridItem>
      )}
    </Grid>
  );
};
