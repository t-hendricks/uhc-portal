import React from 'react';

import { Grid, GridItem, Alert, FormGroup } from '@patternfly/react-core';

import { validateAWSKMSKeyARN } from '~/common/validators';
import ExternalLink from '~/components/common/ExternalLink';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import {
  RadioGroupField,
  RadioGroupOption,
  TextInputField,
} from '~/components/clusters/wizards/form';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { GcpEncryption } from './GcpEncryption';

interface CustomerManagedEncryptionProps {
  hasCustomerManagedKey: boolean;
  region: string;
  cloudProvider: string;
}

export const CustomerManagedEncryption = ({
  hasCustomerManagedKey,
  region,
  cloudProvider,
}: CustomerManagedEncryptionProps) => {
  const isGCP = cloudProvider === CloudProviderType.Gcp;

  const cloudProviderLearnLink = isGCP
    ? 'https://cloud.google.com/storage/docs/encryption/default-keys'
    : 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html';

  const helpText = isGCP
    ? 'Managed via Google Cloud Key Management Service. Used to store and generate encryption keys and encrypt your data.'
    : 'Use a custom AWS KMS key for AWS EBS volume encryption instead of your default AWS KMS key.';

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

  return (
    <Grid hasGutter>
      <GridItem>
        <FormGroup
          fieldId={FieldId.CustomerManagedKey}
          id="customerManagedKey"
          label="Encryption Keys"
          isRequired
          isInline
        >
          <div className="pf-u-font-size-sm pf-u-pb-md">
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

      {hasCustomerManagedKey?.toString() === 'true' &&
        (isGCP ? (
          <GcpEncryption region={region} />
        ) : (
          <GridItem>
            <TextInputField
              name={FieldId.KmsKeyArn}
              label="Key ARN"
              validate={(value) => validateAWSKMSKeyARN(value, region)}
              helperText="Provide a custom key ARN"
              tooltip={
                <>
                  <p className="pf-u-mb-sm">{constants.awsKeyARN}</p>
                  <ExternalLink href="https://docs.aws.amazon.com/kms/latest/developerguide/find-cmk-id-arn.html">
                    Finding the key ID and ARN
                  </ExternalLink>
                </>
              }
            />
            <GridItem md={6}>
              <Alert
                className="pf-u-mt-sm"
                isInline
                isLiveRegion
                variant="info"
                title="If you delete the ARN key, the cluster will no longer be available."
              />
            </GridItem>
          </GridItem>
        ))}
    </Grid>
  );
};
