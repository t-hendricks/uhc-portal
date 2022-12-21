import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Grid, GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import ExternalLink from '~/components/common/ExternalLink';
import GCPClusterEncryption from './GCPEncryptionSection';
import AWSCustomerManagedEncryption from './AWSEncryptionSection';
import './encryptionSection.scss';

function CustomerManagedEncryption({
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
}) {
  const isGCP = cloudProviderID === 'gcp';

  const cloudProviderLearnLink = isGCP
    ? 'https://cloud.google.com/storage/docs/encryption/default-keys'
    : 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/data-protection.html';

  const helpText = isGCP
    ? 'Managed via Google Cloud Key Management Service. Used to store and generate encryption keys and encrypt your data.'
    : 'Use a custom AWS KMS key for AWS EBS volume encryption instead of your default AWS KMS key.';

  return (
    <Grid hasGutter>
      <GridItem>
        <FormGroup
          fieldId="customer_managed_key"
          id="customerManagedKey"
          label="Encryption Keys"
          isInline
        >
          <div className="encryptionkeys-description">
            The cloud storage for your cluster is encrypted at rest.{' '}
            <ExternalLink href={cloudProviderLearnLink}>Learn more</ExternalLink>
          </div>

          <Field
            component={RadioButtons}
            name="customer_managed_key"
            defaultValue={
              customerManagedEncryptionSelected ? customerManagedEncryptionSelected : 'false'
            }
            options={[
              {
                value: 'false',
                label: 'Use default KMS Keys',
              },
              {
                value: 'true',
                label: 'Use custom KMS keys',
                extendedHelpText: helpText,
              },
            ]}
          />
        </FormGroup>
      </GridItem>

      <GridItem>
        {customerManagedEncryptionSelected === 'true' &&
          (isGCP ? (
            <GCPClusterEncryption selectedRegion={selectedRegion} />
          ) : (
            <AWSCustomerManagedEncryption region={selectedRegion} />
          ))}
      </GridItem>
    </Grid>
  );
}

CustomerManagedEncryption.propTypes = {
  customerManagedEncryptionSelected: PropTypes.bool,
  selectedRegion: PropTypes.string,
  cloudProviderID: PropTypes.string,
};

export default CustomerManagedEncryption;
