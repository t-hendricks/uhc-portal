import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Title } from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ExternalLink from '../../../../../common/ExternalLink';

import { constants } from '../../CreateOSDFormConstants';
import GCPClusterEncryption from './GCPEncryptionSection';
import AWSCustomerManagedEncryption from './AWSEncryptionSection';

function CustomerManagedEncryption({
  customerManagedEncryptionSelected,
  selectedRegion,
  cloudProviderID,
}) {
  const isGCP = cloudProviderID === 'gcp';
  const gcpDesc =
    'Managed via Google Cloud Key Management Service. Used to store and generate encryption keys and encrypt your data.';
  const awsDesc =
    'Use a custom AWS KMS key for AWS EBS volume encryption instead of your default AWS KMS key.';

  return (
    <>
      <FormGroup fieldId="customer_managed_key" id="customerManagedKey">
        <Field
          component={ReduxCheckbox}
          name="customer_managed_key"
          label="Encrypt persistent volumes with customer keys"
          extendedHelpText={
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
        />
        <div className="ocm-c--reduxcheckbox-description">{isGCP ? gcpDesc : awsDesc}</div>
      </FormGroup>

      {customerManagedEncryptionSelected &&
        (isGCP ? (
          <GCPClusterEncryption selectedRegion={selectedRegion} />
        ) : (
          <AWSCustomerManagedEncryption region={selectedRegion} />
        ))}
    </>
  );
}

CustomerManagedEncryption.propTypes = {
  customerManagedEncryptionSelected: PropTypes.bool,
  selectedRegion: PropTypes.string,
  cloudProviderID: PropTypes.string,
};

export default CustomerManagedEncryption;
