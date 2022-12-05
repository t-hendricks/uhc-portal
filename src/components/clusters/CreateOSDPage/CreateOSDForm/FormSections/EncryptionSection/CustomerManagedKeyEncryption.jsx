import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Grid, GridItem, Text, TextVariants } from '@patternfly/react-core';
import { Field } from 'redux-form';
import RadioButtons from '~/components/common/ReduxFormComponents/RadioButtons';
// import ExternalLink from '../../../../../common/ExternalLink';

// import { constants } from '../../CreateOSDFormConstants';
import GCPClusterEncryption from './GCPEncryptionSection';
import AWSCustomerManagedEncryption from './AWSEncryptionSection';

function CustomerManagedEncryption({
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
}) {
  const isGCP = cloudProviderID === 'gcp';
  // const gcpDesc =
  //   'Managed via Google Cloud Key Management Service. Used to store and generate encryption keys and encrypt your data.';
  // const awsDesc =
  //   'Use a custom AWS KMS key for AWS EBS volume encryption instead of your default AWS KMS key.';

  return (
    <Grid hasGutter>
      <GridItem rowSpan={1}>
        <FormGroup
          fieldId="customer_managed_key"
          id="customerManagedKey"
          label="Encryption Keys"
          isInline
        >
          <br />
          <br />
          <Text component={TextVariants.p}>
            The cloud storage for your cluster is encrypted at rest
          </Text>

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
          {/* <div className="ocm-c--reduxcheckbox-description">{isGCP ? gcpDesc : awsDesc}</div> */}
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
