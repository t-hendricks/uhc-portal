import React from 'react';
import PropTypes from 'prop-types';
import { GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';

import VPCDropdown from '~/components/clusters/wizards/common/VPCDropdown/VPCDropdown';
import { SubnetSelectField } from '~/components/clusters/common/SubnetSelectField';
import { getMatchingAvailabilityZones } from '~/common/vpcHelpers';
import WithTooltip from '~/components/common/WithTooltip';
import AvailabilityZoneSelection, {
  PLACEHOLDER_VALUE,
} from '~/components/clusters/wizards/common/NetworkingSection/AvailabilityZoneSelection';
import {
  required,
  validateValueNotPlaceholder,
  validateRosaUniqueAZ,
} from '../../../../../common/validators';

const SingleSubnetFieldsRow = ({
  index,
  selectedAZ,
  selectedRegion,
  selectedVPC,
  isMultiAz,
  privateLinkSelected,
}) => {
  const azValidations = [
    isMultiAz && validateRosaUniqueAZ,
    validateValueNotPlaceholder(PLACEHOLDER_VALUE),
    required,
  ].filter(Boolean);

  const showLabels = index === 0;
  let disabledSubnetReason;
  let disabledAzReason;
  if (!selectedVPC?.id) {
    disabledAzReason = 'Select a VPC first';
    disabledSubnetReason = 'Select a VPC first';
  } else if (!selectedAZ) {
    disabledSubnetReason = 'Select the availability zone';
  }

  // We'll only allow users to select AZs that have all necessary subnets
  const privacyList = privateLinkSelected ? ['private'] : ['private', 'public'];
  const enabledAvailabilityZones = getMatchingAvailabilityZones(
    selectedRegion,
    selectedVPC,
    privacyList,
  );

  return (
    <>
      <GridItem md={4}>
        <WithTooltip showTooltip={!!disabledAzReason} content={disabledAzReason}>
          <Field
            component={AvailabilityZoneSelection}
            name={`machinePoolsSubnets[${index}].availabilityZone`}
            label={showLabels ? 'Availability zone' : null}
            enabledAvailabilityZones={enabledAvailabilityZones}
            validate={azValidations}
            isDisabled={!!disabledAzReason}
            region={selectedRegion}
          />
        </WithTooltip>
      </GridItem>
      <GridItem md={4}>
        <WithTooltip showTooltip={!!disabledSubnetReason} content={disabledSubnetReason}>
          <Field
            component={SubnetSelectField}
            name={`machinePoolsSubnets[${index}].privateSubnetId`}
            isRequired
            validate={required}
            privacy="private"
            label={showLabels ? 'Private subnet' : null}
            selectedVPC={selectedVPC}
            allowedAZs={selectedAZ ? [selectedAZ] : []}
            withAutoSelect={false}
          />
        </WithTooltip>
      </GridItem>
      <GridItem md={4}>
        {!privateLinkSelected && (
          <WithTooltip showTooltip={!!disabledSubnetReason} content={disabledSubnetReason}>
            <Field
              component={SubnetSelectField}
              name={`machinePoolsSubnets[${index}].publicSubnetId`}
              isRequired
              validate={required}
              privacy="public"
              label={showLabels ? 'Public subnet' : null}
              selectedVPC={selectedVPC}
              allowedAZs={selectedAZ ? [selectedAZ] : []}
              withAutoSelect={false}
            />
          </WithTooltip>
        )}
      </GridItem>
    </>
  );
};

const AWSSubnetFields = ({
  selectedVPC,
  selectedRegion,
  selectedAZs,
  isMultiAz,
  privateLinkSelected,
}) => (
  <>
    <Field
      component={VPCDropdown}
      name="selected_vpc"
      validate={(value) => (value?.id?.length > 0 || value?.name?.length > 0 ? undefined : 'error')}
      selectedVPC={selectedVPC}
      showRefresh
      isHypershift={false}
    />

    <SingleSubnetFieldsRow
      index={0}
      selectedAZ={selectedAZs[0]}
      selectedRegion={selectedRegion}
      selectedVPC={selectedVPC}
      isMultiAz={isMultiAz}
      privateLinkSelected={privateLinkSelected}
    />
    {isMultiAz && (
      <>
        <SingleSubnetFieldsRow
          index={1}
          selectedAZ={selectedAZs[1]}
          selectedRegion={selectedRegion}
          selectedVPC={selectedVPC}
          isMultiAz={isMultiAz}
          privateLinkSelected={privateLinkSelected}
        />
        <SingleSubnetFieldsRow
          index={2}
          selectedAZ={selectedAZs[2]}
          selectedRegion={selectedRegion}
          selectedVPC={selectedVPC}
          isMultiAz={isMultiAz}
          privateLinkSelected={privateLinkSelected}
        />
      </>
    )}
  </>
);

SingleSubnetFieldsRow.propTypes = {
  selectedRegion: PropTypes.string,
  selectedVPC: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  selectedAZ: PropTypes.string,
  index: PropTypes.number,
  isMultiAz: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

AWSSubnetFields.propTypes = {
  selectedVPC: PropTypes.object,
  selectedRegion: PropTypes.string,
  selectedAZs: PropTypes.arrayOf(PropTypes.string),
  isMultiAz: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

export { SingleSubnetFieldsRow };
export default AWSSubnetFields;
