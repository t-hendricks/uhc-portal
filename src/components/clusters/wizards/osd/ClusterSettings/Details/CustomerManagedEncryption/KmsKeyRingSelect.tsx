import React from 'react';
import { useDispatch } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { Field } from 'formik';

import { GridItem, Text } from '@patternfly/react-core';

import { useGlobalState } from '~/redux/hooks/useGlobalState';
import { getGCPKeyRings } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesActions';
import DynamicSelect from '~/components/common/DynamicSelect';
import { useFormState } from '~/components/clusters/wizards/hooks';
import PopoverHint from '~/components/common/PopoverHint';
import { constants } from '~/components/clusters/CreateOSDPage/CreateOSDForm/CreateOSDFormConstants';
import { CloudProviderType } from '~/components/clusters/wizards/common/constants';
import { required } from '~/common/validators';
import ExternalLink from '~/components/common/ExternalLink';
import { getGcpCcsCredentials } from '~/components/clusters/wizards/common/utils/ccsCredentials';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { KeyRing } from '~/types/clusters_mgmt.v1';

export const KmsKeyRingSelect = () => {
  const dispatch = useDispatch();
  const { gcpKeyRings } = useGlobalState((state) => state.ccsInquiries);
  const { values, getFieldProps, setFieldValue, getFieldMeta } = useFormState();
  const ccsCredentials = getGcpCcsCredentials(values);

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
        input={{
          ...getFieldProps(FieldId.KeyRing),
          onChange: (value: string) => setFieldValue(FieldId.KeyRing, value),
        }}
        meta={getFieldMeta(FieldId.KeyRing)}
        hasDependencies={hasDependencies}
        matchesDependencies={matchesDependencies}
        requestStatus={gcpKeyRings}
        items={(gcpKeyRings.data?.items || []).map((ring: KeyRing) => ring.name)}
        loadData={() => hasDependencies && dispatch(getGCPKeyRings(ccsCredentials, keyLocation))}
      />
    </GridItem>
  );
};
