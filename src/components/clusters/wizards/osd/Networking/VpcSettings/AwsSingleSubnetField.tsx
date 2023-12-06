import React from 'react';
import { Field } from 'formik';

import { GridItem } from '@patternfly/react-core';

import {
  required,
  validateUniqueAZ,
  validateValueNotPlaceholder,
  validateAWSSubnet,
} from '~/common/validators';
import WithTooltip from '~/components/common/WithTooltip';
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
  isDisabled: boolean;
}

const AwsSingleSubnetField = ({
  index,
  region,
  isMultiAz,
  usePrivateLink,
  isDisabled,
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
        <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
          <Field
            component={AvailabilityZoneSelection}
            name={azFieldName}
            label={showLabels ? 'Availability zone' : undefined}
            validate={validateAvailabilityZone}
            isDisabled={isDisabled}
            region={region}
            input={{
              ...getFieldProps(azFieldName),
              onChange: (value: string) => setFieldValue(azFieldName, value),
            }}
            meta={getFieldMeta(azFieldName)}
          />
        </WithTooltip>
      </GridItem>
      <GridItem md={4}>
        <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
          <TextInputField
            name={privateSubnetIdName}
            label={showLabels ? 'Private subnet ID' : undefined}
            validate={validatePrivateSubnet}
            isDisabled={isDisabled}
          />
        </WithTooltip>
      </GridItem>
      {!usePrivateLink && (
        <GridItem md={4}>
          <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
            <TextInputField
              name={publicSubnetIdName}
              label={showLabels ? 'Public subnet ID' : undefined}
              validate={validatePublicSubnet}
              isDisabled={isDisabled}
            />
          </WithTooltip>
        </GridItem>
      )}
      {usePrivateLink && <GridItem md={4} />}
    </>
  );
};

export default AwsSingleSubnetField;
