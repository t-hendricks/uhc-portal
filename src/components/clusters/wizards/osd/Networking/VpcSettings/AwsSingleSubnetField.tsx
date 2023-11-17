import React from 'react';
import { Field } from 'formik';

import { GridItem } from '@patternfly/react-core';

import {
  required,
  validateUniqueAZ,
  validateValueNotPlaceholder,
  validateAWSSubnet,
} from '~/common/validators';
import AvailabilityZoneSelection, {
  PLACEHOLDER_VALUE,
} from '~/components/clusters/CreateOSDPage/CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { TextInputField } from '~/components/clusters/wizards/form';

interface SingleSubnetFieldProps {
  index: number;
  region: string;
  isMultiAz: boolean;
  usePrivateLink: boolean;
}

const AwsSingleSubnetField = ({
  index,
  region,
  isMultiAz,
  usePrivateLink,
}: SingleSubnetFieldProps) => {
  const { values, getFieldProps, getFieldMeta, setFieldValue } = useFormState();
  const azFieldName = `az_${index}`;
  const privateSubnetIdName = `private_subnet_id_${index}`;
  const publicSubnetIdName = `public_subnet_id_${index}`;
  const showLabels = index === 0;

  const validateAvailabilityZone = (value: string) =>
    required(value) ||
    (isMultiAz && validateUniqueAZ(value, values, null, azFieldName)) ||
    validateValueNotPlaceholder(PLACEHOLDER_VALUE)(value);

  const validatePrivateSubnet = (value: string) =>
    validateAWSSubnet(value, values, {}, privateSubnetIdName);
  const validatePublicSubnet = (value: string) =>
    validateAWSSubnet(value, values, {}, publicSubnetIdName);

  return (
    <>
      <GridItem className="vpc-input-field" md={4}>
        <Field
          component={AvailabilityZoneSelection}
          name={azFieldName}
          label={showLabels ? 'Availability zone' : undefined}
          validate={validateAvailabilityZone}
          region={region}
          input={{
            ...getFieldProps(azFieldName),
            onChange: (value: string) => setFieldValue(azFieldName, value),
          }}
          meta={getFieldMeta(azFieldName)}
        />
      </GridItem>
      <GridItem md={4}>
        <TextInputField
          name={privateSubnetIdName}
          validate={validatePrivateSubnet}
          label={showLabels ? 'Private subnet ID' : undefined}
        />
      </GridItem>
      {!usePrivateLink && (
        <GridItem md={4}>
          <TextInputField
            name={publicSubnetIdName}
            validate={validatePublicSubnet}
            label={showLabels ? 'Public subnet ID' : undefined}
          />
        </GridItem>
      )}
      {usePrivateLink && <GridItem md={4} />}
    </>
  );
};

export default AwsSingleSubnetField;
