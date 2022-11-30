import React from 'react';
import { Field } from 'formik';

import { GridItem, FormGroup } from '@patternfly/react-core';

import { validateGCPKMSServiceAccount } from '~/common/validators';
import KMSKeyLocationComboBox from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/EncryptionSection/KMSKeyLocationComboBox';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import PopoverHint from '~/components/common/PopoverHint';
import { useFormState } from '~/components/osd/hooks';
import { FieldId } from '~/components/osd/constants';
import { TextInputField } from '~/components/osd/common/form';
import { KmsKeyRingSelect } from './KmsKeyRingSelect';
import { KmsKeySelect } from './KmsKeySelect';

interface GcpEncryptionProps {
  region: string;
}

export const GcpEncryption = ({ region }: GcpEncryptionProps) => {
  const { getFieldProps, setFieldValue } = useFormState();

  return (
    <>
      <GridItem>
        <FormGroup
          label="Key ring location"
          fieldId={FieldId.KeyLocation}
          labelIcon={<PopoverHint hint={constants.regionHint} />}
        >
          <Field
            component={KMSKeyLocationComboBox}
            name={FieldId.KeyLocation}
            selectedRegion={region}
            input={{
              ...getFieldProps(FieldId.KeyLocation),
              onChange: (value: string) => setFieldValue(FieldId.KeyLocation, value),
            }}
          />
        </FormGroup>
      </GridItem>

      <KmsKeyRingSelect />
      <KmsKeySelect />

      <GridItem>
        <TextInputField
          name={FieldId.KmsServiceAccount}
          label="KMS Service Account"
          tooltip={constants.kmsserviceAccount}
          validate={validateGCPKMSServiceAccount}
          helperText="GCP Service account will be used for compute scaling."
        />
      </GridItem>
    </>
  );
};
