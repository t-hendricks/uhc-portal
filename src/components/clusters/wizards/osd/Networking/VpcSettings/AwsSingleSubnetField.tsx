import React from 'react';
import { Field } from 'formik';

import { GridItem } from '@patternfly/react-core';

import useFormikOnChange from '~/hooks/useFormikOnChange';
import { required, validateUniqueAZ } from '~/common/validators';
import WithTooltip from '~/components/common/WithTooltip';
import AvailabilityZoneSelection from '~/components/clusters/wizards/common/NetworkingSection/AvailabilityZoneSelection';
import { useFormState } from '~/components/clusters/wizards/hooks';
import { getMatchingAvailabilityZones, SubnetPrivacy } from '~/common/vpcHelpers';
import { FieldId } from '~/components/clusters/wizards/osd/constants';
import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';

const AwsSingleSubnetField = ({ index }: { index: number }) => {
  const {
    values: {
      [FieldId.UsePrivateLink]: usePrivateLink,
      [FieldId.SelectedVpc]: selectedVPC,
      [FieldId.Region]: selectedRegion,
      [FieldId.MultiAz]: multiAz,
      [FieldId.MachinePoolsSubnets]: machinePoolsSubnets,
    },
    getFieldProps,
    getFieldMeta,
    setFieldTouched,
    setFieldValue,
  } = useFormState();
  const azFieldName = `${FieldId.MachinePoolsSubnets}[${index}].availabilityZone`;
  const privateSubnetIdName = `${FieldId.MachinePoolsSubnets}[${index}].privateSubnetId`;
  const publicSubnetIdName = `${FieldId.MachinePoolsSubnets}[${index}].publicSubnetId`;
  const currentMp = machinePoolsSubnets[index];

  const showLabels = index === 0;
  const isMultiAz = multiAz === 'true';

  const onChangePrivate = useFormikOnChange(privateSubnetIdName);
  const onChangePublic = useFormikOnChange(publicSubnetIdName);

  const onChangeAZ = (value: string) => {
    setFieldValue(azFieldName, value);
    // Necessary to get the correct validation status when switching from Single to Multi zone
    setFieldTouched(privateSubnetIdName, true, true);
  };

  const validateAvailabilityZone = (az?: string) => {
    // Adding this validation because otherwise, when switching from Single to Multi zone,
    // users can move to Next step even though 2nd and 3rd subnets are not filled in
    const isValidMP = currentMp.privateSubnetId && (usePrivateLink || currentMp.publicSubnetId);
    return (
      required(az) ||
      (isMultiAz && validateUniqueAZ(az, { machinePoolsSubnets })) ||
      (isValidMP ? '' : 'Select the subnets for this availability zone')
    );
  };

  // We'll only allow users to select AZs that have all necessary subnets
  const privacyList: SubnetPrivacy[] = usePrivateLink ? ['private'] : ['private', 'public'];
  const enabledAvailabilityZones = getMatchingAvailabilityZones(
    selectedRegion,
    selectedVPC,
    privacyList,
  );

  const isDisabled = !selectedVPC?.id;
  const allowedAZs = currentMp.availabilityZone ? [currentMp.availabilityZone] : [];

  return (
    <>
      <GridItem className="vpc-input-field" md={4}>
        <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
          <Field
            component={AvailabilityZoneSelection}
            name={azFieldName}
            label={showLabels ? 'Availability zone' : undefined}
            validate={validateAvailabilityZone}
            enabledAvailabilityZones={enabledAvailabilityZones}
            isDisabled={isDisabled}
            region={selectedRegion}
            input={{
              ...getFieldProps(azFieldName),
              onChange: onChangeAZ,
            }}
            meta={getFieldMeta(azFieldName)}
          />
        </WithTooltip>
      </GridItem>
      <GridItem md={4}>
        <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
          <Field
            component={SubnetSelectField}
            name={privateSubnetIdName}
            label={showLabels ? 'Private subnet' : undefined}
            validate={required}
            input={{
              ...getFieldProps(privateSubnetIdName),
              onChange: onChangePrivate,
            }}
            meta={getFieldMeta(privateSubnetIdName)}
            privacy="private"
            selectedVPC={selectedVPC}
            withAutoSelect={false}
            allowedAZs={allowedAZs}
          />
        </WithTooltip>
      </GridItem>
      {!usePrivateLink && (
        <GridItem md={4}>
          <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
            <Field
              component={SubnetSelectField}
              name={publicSubnetIdName}
              label={showLabels ? 'Public subnet' : undefined}
              validate={required}
              input={{
                ...getFieldProps(publicSubnetIdName),
                onChange: onChangePublic,
              }}
              meta={getFieldMeta(publicSubnetIdName)}
              privacy="public"
              selectedVPC={selectedVPC}
              withAutoSelect={false}
              allowedAZs={allowedAZs}
            />
          </WithTooltip>
        </GridItem>
      )}
      {usePrivateLink && <GridItem md={4} />}
    </>
  );
};

export default AwsSingleSubnetField;
