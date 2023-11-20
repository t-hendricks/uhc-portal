import React from 'react';
import PropTypes from 'prop-types';
import { GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';

import VPCDropdown from '~/components/clusters/CreateOSDPage/CreateOSDWizard/MachinePoolScreen/VPCDropdown';
import WithTooltip from '~/components/common/WithTooltip';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import AvailabilityZoneSelection, {
  PLACEHOLDER_VALUE,
} from '../../CreateOSDForm/FormSections/NetworkingSection/AvailabilityZoneSelection';
import {
  required,
  rosaWizardAWSSubnetValidators,
  validateValueNotPlaceholder,
  validateUniqueAZ,
} from '../../../../../common/validators';

const SingleSubnetFieldsRow = ({
  showLabels = false,
  index,
  selectedRegion,
  isMultiAz,
  isDisabled,
  privateLinkSelected,
}) => {
  const azValidations = [
    isMultiAz && validateUniqueAZ,
    validateValueNotPlaceholder(PLACEHOLDER_VALUE),
    required,
  ].filter(Boolean);

  return (
    <>
      <GridItem md={4}>
        <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
          <Field
            component={AvailabilityZoneSelection}
            name={`az_${index}`}
            label={showLabels ? 'Availability zone' : null}
            validate={azValidations}
            isDisabled={isDisabled}
            region={selectedRegion}
          />
        </WithTooltip>
      </GridItem>
      <GridItem md={4}>
        <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
          <Field
            component={ReduxVerticalFormGroup}
            name={`private_subnet_id_${index}`}
            label={showLabels ? 'Private subnet ID' : null}
            isDisabled={isDisabled}
            type="text"
            isRequired
            validate={[required, rosaWizardAWSSubnetValidators.validateROSAWizardSubnet]}
          />
        </WithTooltip>
      </GridItem>
      <GridItem md={4}>
        {!privateLinkSelected && (
          <WithTooltip showTooltip={isDisabled} content="Select a VPC first">
            <Field
              component={ReduxVerticalFormGroup}
              name={`public_subnet_id_${index}`}
              label={showLabels ? 'Public subnet ID' : null}
              type="text"
              isRequired
              isDisabled={isDisabled}
              validate={[required, rosaWizardAWSSubnetValidators.validateROSAWizardSubnet]}
            />
          </WithTooltip>
        )}
      </GridItem>
    </>
  );
};

const AWSSubnetFields = ({ selectedVPC, selectedRegion, isMultiAz, privateLinkSelected }) => (
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
      showLabels
      index={0}
      selectedRegion={selectedRegion}
      isMultiAz={isMultiAz}
      isDisabled={!selectedVPC?.id}
      privateLinkSelected={privateLinkSelected}
    />
    {isMultiAz && (
      <>
        <SingleSubnetFieldsRow
          index={1}
          selectedRegion={selectedRegion}
          isDisabled={!selectedVPC?.id}
          isMultiAz={isMultiAz}
          privateLinkSelected={privateLinkSelected}
        />
        <SingleSubnetFieldsRow
          index={2}
          selectedRegion={selectedRegion}
          isDisabled={!selectedVPC?.id}
          isMultiAz={isMultiAz}
          privateLinkSelected={privateLinkSelected}
        />
      </>
    )}
  </>
);

SingleSubnetFieldsRow.propTypes = {
  selectedRegion: PropTypes.string,
  index: PropTypes.number,
  showLabels: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isMultiAz: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

AWSSubnetFields.propTypes = {
  selectedVPC: PropTypes.object,
  selectedRegion: PropTypes.string,
  isMultiAz: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

export { SingleSubnetFieldsRow };
export default AWSSubnetFields;
