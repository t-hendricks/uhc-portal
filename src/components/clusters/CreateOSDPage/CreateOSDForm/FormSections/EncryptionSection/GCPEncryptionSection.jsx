import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, FormGroup, Text } from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '~/components/common/ReduxFormComponents/ReduxVerticalFormGroup';
import { required, validateGCPKMSServiceAccount } from '~/common/validators';
import { constants } from '../../CreateOSDFormConstants';

import ExternalLink from '~/components/common/ExternalLink';
import PopoverHint from '~/components/common/PopoverHint';
import KMSKeyLocationComboBox from './KMSKeyLocationComboBox';
import KMSKeyRingSelect from './KMSKeyRingSelect';
import KMSKeySelect from './KMSKeySelect';

function GCPCustomerManagedEncryption({ selectedRegion }) {
  return (
    <>
      <Grid hasGutter>
        <GridItem md={6}>
          <FormGroup
            label="Key ring location"
            fieldId="key_location"
            labelIcon={<PopoverHint hint={constants.regionHint} />}
            isRequired
          >
            <Field
              component={KMSKeyLocationComboBox}
              name="key_location"
              selectedRegion={selectedRegion}
              className="pf-c-form-control"
            />
          </FormGroup>
        </GridItem>
        <GridItem md={6} />

        <GridItem md={6}>
          <Field
            component={KMSKeyRingSelect}
            name="key_ring"
            label="Key ring"
            labelIcon={<PopoverHint hint={constants.keyRing} />}
            helperText="A key ring organizes keys in a specific Google Cloud location."
            noDependenciesPlaceholder="Enter GCP credentials first"
            placeholder="Select key ring"
            requestErrorTitle="Error listing key rings using your GCP credentials"
            emptyAlertTitle="No key rings found for this location"
            emptyAlertBody={
              <>
                <Text>
                  If available, change the Key ring location. Or go to your{' '}
                  <ExternalLink href="https://console.cloud.google.com/security/kms">
                    Google Cloud Console
                  </ExternalLink>{' '}
                  and create the key ring.
                </Text>
                <Text>
                  Once created, refresh using the <strong>Refresh custom key rings</strong> button.
                </Text>
              </>
            }
            refreshButtonText="Refresh custom key rings"
            validate={required}
            isRequired
            className="pf-c-form-control"
          />
        </GridItem>
        <GridItem md={6} />

        <GridItem md={6}>
          <Field
            component={KMSKeySelect}
            name="key_name"
            label="Key name"
            labelIcon={<PopoverHint hint={constants.keyName} />}
            helperText="Name of the key in the keyring."
            placeholder="Select key"
            requestErrorTitle="Error listing keys using your GCP credentials"
            emptyAlertTitle="No keys found for this location and key ring"
            emptyAlertBody={
              <>
                <Text>
                  If available, change the Key ring location / Key ring. Or go to your{' '}
                  <ExternalLink href="https://console.cloud.google.com/security/kms">
                    Google Cloud Console
                  </ExternalLink>{' '}
                  and create the key.
                </Text>
                <Text>
                  Once created, refresh using the <strong>Refresh custom keys</strong> button.
                </Text>
              </>
            }
            refreshButtonText="Refresh custom keys"
            validate={required}
            isRequired
            className="pf-c-form-control"
          />
        </GridItem>
        <GridItem md={6} />

        <GridItem md={6}>
          <Field
            component={ReduxVerticalFormGroup}
            name="kms_service_account"
            type="text"
            label="KMS Service Account"
            placeholder="KMS Service Account"
            validate={validateGCPKMSServiceAccount}
            isRequired
            helpText="GCP Service account will be used for compute scaling."
            extendedHelpText={<>{constants.kmsserviceAccount}</>}
            showHelpTextOnError={false}
          />
        </GridItem>
        <GridItem md={6} rowSpan={2} />
      </Grid>
    </>
  );
}

GCPCustomerManagedEncryption.propTypes = {
  selectedRegion: PropTypes.string,
};

export default GCPCustomerManagedEncryption;
