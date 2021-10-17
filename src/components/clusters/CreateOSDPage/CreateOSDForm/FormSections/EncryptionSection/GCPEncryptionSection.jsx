import React from 'react';
import PropTypes from 'prop-types';
import {
  GridItem, FormGroup,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import { validateGCPEncryptionKeys, validateGCPKMSServiceAccount } from '../../../../../../common/validators';
import { constants } from '../../CreateOSDFormConstants';

import PopoverHint from '../../../../../common/PopoverHint';
import KMSKeyLocationComboBox from './KMSKeyLocationComboBox';

function GCPCustomerManagedEncryption({ selectedRegion }) {
  return (
    <>
      <GridItem sm={12} md={5} lg={4}>
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
      <GridItem md={7} lg={8} />
      <GridItem sm={12} md={5} lg={4}>
        <FormGroup
          label="Key ring location"
          fieldId="key_location"
          labelIcon={<PopoverHint hint={constants.regionHint} />}
        >
          <Field
            component={KMSKeyLocationComboBox}
            name="key_location"
            selectedRegion={selectedRegion}
            className="pf-c-form-control"
          />
        </FormGroup>
      </GridItem>
      <GridItem md={7} lg={8} />
      <GridItem sm={12} md={5} lg={4}>
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
      <GridItem md={7} lg={8} />
      <GridItem sm={12} md={5} lg={4}>
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
      <GridItem md={7} lg={8} />
    </>
  );
}

GCPCustomerManagedEncryption.propTypes = {
  selectedRegion: PropTypes.string,
};

export default GCPCustomerManagedEncryption;
