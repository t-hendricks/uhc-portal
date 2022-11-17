import React from 'react';
import { useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { Field } from 'formik';

import { GridItem } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getGCPKeyRings } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import DynamicSelect from '~/components/common/DynamicSelect';
import { FieldId } from '~/components/osd/constants';
import { useFormState } from '~/components/osd/hooks';
import { getCcsCredentials } from '~/components/osd/utils';
import PopoverHint from '~/components/common/PopoverHint';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { required } from '~/common/validators';
import { CloudProviderType } from '../../CloudProvider/types';

export const KmsKeyRingSelect = () => {
  const dispatch = useDispatch();
  const { gcpKeyRings } = useGlobalState((state) => state.ccsInquiries);
  const { values, getFieldProps, setFieldValue, getFieldMeta } = useFormState();
  const ccsCredentials = getCcsCredentials(values);

  const { [FieldId.KeyLocation]: keyLocation } = values;
  const hasDependencies = !!(ccsCredentials && keyLocation);
  const matchesDependencies =
    gcpKeyRings.cloudProvider === CloudProviderType.Gcp &&
    isEqual(gcpKeyRings.credentials, ccsCredentials) &&
    gcpKeyRings.keyLocation === keyLocation;

  return (
    <GridItem>
      <Field
        component={DynamicSelect}
        name={FieldId.KeyRing}
        label="Key ring"
        labelIcon={<PopoverHint hint={constants.keyRing} />}
        helperText="A key ring organizes keys in a specific Google Cloud location."
        noDependenciesPlaceholder="Enter GCP credentials first"
        emptyPlaceholder="No key rings"
        placeholder="Select key ring"
        requestErrorTitle="Error listing key rings using your GCP credentials"
        validate={required}
        isRequired
        input={{
          ...getFieldProps(FieldId.KeyRing),
          onChange: (value: string) => setFieldValue(FieldId.KeyRing, value),
        }}
        meta={getFieldMeta(FieldId.KeyRing)}
        hasDependencies={hasDependencies}
        matchesDependencies={matchesDependencies}
        requestStatus={gcpKeyRings}
        items={(gcpKeyRings.data?.items || []).map((ring: { name: string }) => ring.name)}
        loadData={() => dispatch(getGCPKeyRings(ccsCredentials, keyLocation))}
      />
    </GridItem>
  );
};
