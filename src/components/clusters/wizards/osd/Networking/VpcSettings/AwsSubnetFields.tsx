import React from 'react';
import { Field } from 'formik';
import { Grid, GridItem } from '@patternfly/react-core';

import { CloudVPC } from '~/types/clusters_mgmt.v1';
import VPCDropdown from '~/components/clusters/CreateOSDPage/CreateOSDWizard/MachinePoolScreen/VPCDropdown';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import AwsSingleSubnetField from './AwsSingleSubnetField';

export const AwsSubnetFields = () => {
  const { values, dirty, getFieldProps, getFieldMeta, setFieldValue } = useFormState();

  const {
    [FieldId.MultiAz]: multiAz,
    [FieldId.Region]: region,
    [FieldId.UsePrivateLink]: usePrivateLink,
    [FieldId.SelectedVpc]: selectedVPC,
  } = values;

  const isMultiAz = multiAz === 'true';
  const subnetProps = {
    region,
    isMultiAz,
    usePrivateLink,
  };

  const meta = getFieldMeta(FieldId.SelectedVpc);
  return (
    <>
      <Grid>
        <GridItem md={6}>
          <Field
            component={VPCDropdown}
            name={FieldId.SelectedVpc}
            input={{
              ...getFieldProps(FieldId.SelectedVpc),
              onChange: (value: string) => setFieldValue(FieldId.SelectedVpc, value),
            }}
            isOSD
            meta={meta}
            validate={(vpc: CloudVPC) => (dirty && !vpc?.id ? 'error' : undefined)}
            selectedVPC={selectedVPC}
            showRefresh
            isHypershift={false}
          />
        </GridItem>
        <GridItem md={6} />
      </Grid>

      <AwsSingleSubnetField index={0} {...subnetProps} />
      {isMultiAz && (
        <>
          <AwsSingleSubnetField index={1} {...subnetProps} />
          <AwsSingleSubnetField index={2} {...subnetProps} />
        </>
      )}
    </>
  );
};
