import React from 'react';
import { useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { Field } from 'formik';

import { GridItem } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { required } from '~/common/validators';
import { getCcsCredentials } from '~/components/osd/utils';
import { FieldId } from '~/components/osd/constants';
import { useFormState } from '~/components/osd/hooks';
import { getGCPKeys } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import PopoverHint from '~/components/common/PopoverHint';
import DynamicSelect from '~/components/common/DynamicSelect';

export const KmsKeySelect = () => {
  const dispatch = useDispatch();
  const { gcpKeys } = useGlobalState((state) => state.ccsInquiries);
  const { values, getFieldProps, setFieldValue, getFieldMeta } = useFormState();
  const ccsCredentials = getCcsCredentials(values);

  const { [FieldId.KeyLocation]: keyLocation, [FieldId.KeyRing]: keyRing } = values;
  const hasDependencies = !!(ccsCredentials && keyLocation && keyRing);
  const matchesDependencies =
    gcpKeys.cloudProvider === 'gcp' &&
    isEqual(gcpKeys.credentials, ccsCredentials) &&
    gcpKeys.keyLocation === keyLocation &&
    gcpKeys.keyRing === keyRing;

  return (
    <GridItem>
      <Field
        component={DynamicSelect}
        name={FieldId.KeyName}
        label="Key name"
        labelIcon={<PopoverHint hint={constants.keyName} />}
        helperText="Name of the key in the keyring."
        emptyPlaceholder="No keys"
        placeholder="Select key"
        requestErrorTitle="Error listing keys using your GCP credentials"
        validate={required}
        isRequired
        input={{
          ...getFieldProps(FieldId.KeyName),
          onChange: (value: string) => setFieldValue(FieldId.KeyName, value),
        }}
        meta={getFieldMeta(FieldId.KeyName)}
        loadData={() => dispatch(getGCPKeys(ccsCredentials, keyLocation, keyRing))}
        hasDependencies={hasDependencies}
        matchesDependencies={matchesDependencies}
        requestStatus={gcpKeys}
        items={(gcpKeys.data?.items || []).map((key: { name: string }) => key.name)}
      />
    </GridItem>
  );
};
