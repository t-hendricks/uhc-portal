import React from 'react';
import PropTypes from 'prop-types';
import {
  GridItem, FormGroup,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { validateGCPEncryptionKeys, validateGCPKMSServiceAccount } from '../../../../../../common/validators';
import { constants } from '../../CreateOSDFormConstants';
import './GCPClusterEncryption.scss';

import PopoverHint from '../../../../../common/PopoverHint';
import KMSKeyLocationComboBox from './KMSKeyLocationComboBox';

function CustomerManagedEncryptionKeys({
  customerManagedEncryptionSelected, selectedRegion,
}) {
  return (
    <>
      <FormGroup
        fieldId="customer_managed_key"
        id="customer_managed_key"
      >
        <GridItem span={4}>
          <Field
            component={ReduxCheckbox}
            name="customer_managed_key"
            label="Customer Managed Keys"
          />
        </GridItem>
        <div className="ocm-c--reduxcheckbox-description">
          Managed via Google Cloud Key Management Service.
          Used to store and generate encryption keys and encrypt your data.
        </div>
      </FormGroup>

      {customerManagedEncryptionSelected && (
        <>
          <GridItem span={4}>
            <GridItem span={4} className="gcp-encryption-header">
              <Field
                component={ReduxVerticalFormGroup}
                name="key_ring"
                type="text"
                label="Key ring"
                placeholder="Key ring name"
                validate={validateGCPEncryptionKeys}
                helpText="A key ring organizes keys in a specific Google Cloud location."
                extendedHelpText={(
                  <>
                    {constants.keyRing}
                  </>
                  )}
                showHelpTextOnError={false}
              />
            </GridItem>
            <GridItem span={4} className="gcp-encryption-fields">
              <FormGroup
                label="Key ring location"
                fieldId="key_location"
                labelIcon={<PopoverHint hint={constants.regionHint} />}
              >
                <Field
                  component={KMSKeyLocationComboBox}
                  name="key_location"
                  selectedRegion={selectedRegion}
                />
              </FormGroup>
            </GridItem>
            <GridItem span={4} className="gcp-encryption-fields">
              <Field
                component={ReduxVerticalFormGroup}
                name="key_name"
                type="text"
                label="Key name"
                placeholder="Key name"
                validate={validateGCPEncryptionKeys}
                helpText="Name of the key in the keyring."
                extendedHelpText={(
                  <>
                    {constants.keyName}
                  </>
                  )}
                showHelpTextOnError={false}
              />
            </GridItem>
            <GridItem span={4} className="gcp-encryption-fields">
              <Field
                component={ReduxVerticalFormGroup}
                name="kms_service_account"
                type="text"
                label="KMS Service Account"
                placeholder="KMS Service Account"
                validate={validateGCPKMSServiceAccount}
                helpText="GCP Service account will be used for compute scaling."
                extendedHelpText={(
                  <>
                    {constants.kmsserviceAccount}
                  </>
                  )}
                showHelpTextOnError={false}
              />
            </GridItem>
          </GridItem>
        </>
      )}
    </>
  );
}

CustomerManagedEncryptionKeys.propTypes = {
  customerManagedEncryptionSelected: PropTypes.bool,
  selectedRegion: PropTypes.string,
};

export default CustomerManagedEncryptionKeys;
