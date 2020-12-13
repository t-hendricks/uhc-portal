import React from 'react';
import PropTypes from 'prop-types';
import {
  GridItem,
} from '@patternfly/react-core';
import { Field } from 'redux-form';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import AvailabilityZoneSelection from './AvailabilityZoneSelection';
import { required } from '../../../../../../common/validators';

const SubnetFieldsRow = ({
  showLabels = false,
  index,
  selectedRegion,
}) => (
  <>
    <GridItem className="vpc-input-field" span={3}>
      <Field
        component={AvailabilityZoneSelection}
        name={`az_${index}`}
        label={showLabels ? 'Availability zone' : null}
        validate={required}
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

SubnetFieldsRow.propTypes = {
  selectedRegion: PropTypes.string,
  index: PropTypes.number,
  showLabels: PropTypes.bool,
};

export default SubnetFieldsRow;
