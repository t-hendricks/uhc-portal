import React from 'react';

import { GridItem, Title } from '@patternfly/react-core';

import { validateAWSKMSKeyARN } from '~/common/validators';
import ExternalLink from '~/components/common/ExternalLink';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { CloudProviderType } from '../../CloudProvider/types';
import { GcpEncryption } from './GcpEncryption';
import { CheckboxField, TextInputField } from '~/components/osd/common/form';
import { FieldId } from '~/components/osd/constants';

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
  const gcpDesc =
    'Managed via Google Cloud Key Management Service. Used to store and generate encryption keys and encrypt your data.';
  const awsDesc =
    'Use a custom AWS KMS key for AWS EBS volume encryption instead of your default AWS KMS key.';

  return (
    <>
      <CheckboxField
        name="customer_managed_key"
        label="Encrypt persistent volumes with customer keys"
        tooltip={
          <>
            <Title headingLevel="h6" className="pf-u-mb-sm">
              {isGCP ? constants.cloudKMSTitle : constants.amazonEBSTitle}
            </Title>
            <p className="pf-u-mb-sm">{isGCP ? constants.cloudKMS : constants.amazonEBS}</p>
            <ExternalLink
              href={
                isGCP
                  ? 'https://cloud.google.com/kms/docs/resource-hierarchy'
                  : 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html'
              }
            >
              {isGCP ? 'Learn all about Cloud KMS' : 'Learn more about AWS EBS encryption'}
            </ExternalLink>
          </>
        }
        input={{ description: isGCP ? gcpDesc : awsDesc }}
      />

      {hasCustomerManagedKey &&
        (isGCP ? (
          <GcpEncryption region={region} />
        ) : (
          <GridItem>
            <TextInputField
              name={FieldId.KmsKeyArn}
              label="Key ARN"
              validate={validateAWSKMSKeyARN}
              helperText="Unique, fully qualified identifier (Amazon Resource Name (ARN)) for your KMS Key."
              tooltip={
                <>
                  <p className="pf-u-mb-sm">{constants.awsKeyARN}</p>
                  <ExternalLink href="https://docs.aws.amazon.com/kms/latest/developerguide/find-cmk-id-arn.html">
                    Finding the key ID and ARN
                  </ExternalLink>
                </>
              }
            />
          </GridItem>
        ))}
    </>
  );
};
