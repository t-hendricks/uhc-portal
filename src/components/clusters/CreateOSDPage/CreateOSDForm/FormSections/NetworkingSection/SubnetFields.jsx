import React from 'react';
import PropTypes from 'prop-types';
import { GridItem } from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import AvailabilityZoneSelection, { PLACEHOLDER_VALUE } from './AvailabilityZoneSelection';
import {
  required,
  validateUniqueAZ,
  validateValueNotPlaceholder,
} from '../../../../../../common/validators';

import './SubnetFields.scss';

const SingleSubnetFieldsRow = ({
  showLabels = false,
  index,
  selectedRegion,
  isMultiAz,
  privateLinkSelected,
}) => {
  const azValidations = [
    isMultiAz && validateUniqueAZ,
    validateValueNotPlaceholder(PLACEHOLDER_VALUE),
    required,
  ].filter(Boolean);

  return (
    <>
      <GridItem className="vpc-input-field" md={3}>
        <Field
          component={AvailabilityZoneSelection}
          name={`az_${index}`}
          label={showLabels ? 'Availability zone' : null}
          validate={azValidations}
          region={selectedRegion}
        />
      </GridItem>
      <GridItem md={3}>
        <Field
          component={ReduxVerticalFormGroup}
          name={`private_subnet_id_${index}`}
          label={showLabels ? 'Private subnet ID' : null}
          type="text"
          isRequired
          validate={required}
        />
      </GridItem>
      {!privateLinkSelected && (
        <GridItem md={3}>
          <Field
            component={ReduxVerticalFormGroup}
            name={`public_subnet_id_${index}`}
            label={showLabels ? 'Public subnet ID' : null}
            type="text"
            isRequired
            validate={required}
          />
        </GridItem>
      )}
      <GridItem md={privateLinkSelected ? 6 : 3} />
    </>
  );
};

const SubnetFields = ({ selectedRegion, isMultiAz, privateLinkSelected }) => (
  <>
    <SingleSubnetFieldsRow
      showLabels
      index={0}
      selectedRegion={selectedRegion}
      isMultiAz={isMultiAz}
      privateLinkSelected={privateLinkSelected}
    />
    {isMultiAz && (
      <>
        <SingleSubnetFieldsRow
          index={1}
          selectedRegion={selectedRegion}
          isMultiAz={isMultiAz}
          privateLinkSelected={privateLinkSelected}
        />
        <SingleSubnetFieldsRow
          index={2}
          selectedRegion={selectedRegion}
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
  isMultiAz: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

SubnetFields.propTypes = {
  selectedRegion: PropTypes.string,
  isMultiAz: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

export { SingleSubnetFieldsRow };
export default SubnetFields;
