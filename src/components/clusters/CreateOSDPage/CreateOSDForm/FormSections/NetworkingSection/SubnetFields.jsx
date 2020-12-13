import React from 'react';
import PropTypes from 'prop-types';
import {
  GridItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import AvailabilityZoneSelection from './AvailabilityZoneSelection';
import { required, validateUniqueAZ } from '../../../../../../common/validators';

const SingleSubnetFieldsRow = ({
  showLabels = false,
  index,
  selectedRegion,
  isMultiAz,
}) => {
  const azValidations = [
    required,
    isMultiAz && validateUniqueAZ,
  ].filter(Boolean);

  return (
    <>
      <GridItem className="vpc-input-field" span={3}>
        <Field
          component={AvailabilityZoneSelection}
          name={`az_${index}`}
          label={showLabels ? 'Availability zone' : null}
          validate={azValidations}
          region={selectedRegion}
        />
      </GridItem>
      <GridItem span={3}>
        <Field
          component={ReduxVerticalFormGroup}
          name={`private_subnet_id_${index}`}
          label={showLabels ? 'Private subnet ID' : null}
          type="text"
          validate={required}
        />
      </GridItem>
      <GridItem span={3}>
        <Field
          component={ReduxVerticalFormGroup}
          name={`public_subnet_id_${index}`}
          label={showLabels ? 'Public subnet ID' : null}
          type="text"
          validate={required}
        />
      </GridItem>
      <GridItem span={3} />
    </>
  );
};

const SubnetFields = ({
  selectedRegion,
  isMultiAz,
}) => (
  <>
    <SingleSubnetFieldsRow
      showLabels
      index={0}
      selectedRegion={selectedRegion}
      isMultiAz={isMultiAz}
    />
    {
    isMultiAz && (
      <>
        <SingleSubnetFieldsRow
          index={1}
          selectedRegion={selectedRegion}
          isMultiAz={isMultiAz}
        />
        <SingleSubnetFieldsRow
          index={2}
          selectedRegion={selectedRegion}
          isMultiAz={isMultiAz}
        />
      </>
    )
  }
  </>
);

SingleSubnetFieldsRow.propTypes = {
  selectedRegion: PropTypes.string,
  index: PropTypes.number,
  showLabels: PropTypes.bool,
  isMultiAz: PropTypes.bool,
};

SubnetFields.propTypes = {
  selectedRegion: PropTypes.string,
  isMultiAz: PropTypes.bool,
};

export { SingleSubnetFieldsRow };
export default SubnetFields;
