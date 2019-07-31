import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Col } from 'patternfly-react';
import ReduxVerticalFormGroup from '../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../common/validators';
import { NetworkConfugurationHint } from './CreateOSDClusterHelper';

function AdvancedSettingsForm(props) {
  const {
    pending,
  } = props;
  return (
    <React.Fragment>
      <Col sm={5}>
        <Field
          component={ReduxVerticalFormGroup}
          name="network_machine_cidr"
          label="Machine CIDR"
          type="text"
          validate={validators.cidr}
          disabled={pending}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="network_service_cidr"
          label="Service CIDR"
          type="text"
          validate={validators.cidr}
          disabled={pending}
        />
        <Field
          component={ReduxVerticalFormGroup}
          name="network_pod_cidr"
          label="Pod CIDR"
          type="text"
          validate={validators.cidr}
          disabled={pending}
        />
      </Col>
      <Col sm={4}>
        <NetworkConfugurationHint />
      </Col>
    </React.Fragment>
  );
}

AdvancedSettingsForm.propTypes = {
  pending: PropTypes.bool,
};

export default AdvancedSettingsForm;
