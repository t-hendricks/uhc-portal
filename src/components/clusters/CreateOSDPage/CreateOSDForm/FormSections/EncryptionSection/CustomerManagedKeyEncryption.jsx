import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Grid, GridItem, Text, TextVariants } from '@patternfly/react-core';
import { Field } from 'redux-form';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
import GCPClusterEncryption from './GCPEncryptionSection';
import AWSCustomerManagedEncryption from './AWSEncryptionSection';
import './encryptionSection.scss';

function CustomerManagedEncryption({
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
}) {
  const isGCP = cloudProviderID === 'gcp';

  return (
    <Grid hasGutter>
      <GridItem rowSpan={2}>
        <FormGroup
          fieldId="customer_managed_key"
          id="customerManagedKey"
          label="Encryption Keys"
          isInline
        >
          <div className="encryptionkeys-description">
            The cloud storage for your cluster is encrypted at rest.
          </div>

          <Field
            component={RadioButtons}
            name="customer_managed_key"
            defaultValue={customerManagedEncryptionSelected}
            options={[
              {
                value: 'false',
                label: 'Use default KMS Keys',
              },
              {
                value: 'true',
                label: 'Use custom KMS keys',
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
            <AWSCustomerManagedEncryption />
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
