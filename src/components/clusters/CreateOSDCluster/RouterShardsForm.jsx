import PropTypes from 'prop-types';
import React from 'react';
import { Field, FormSection } from 'redux-form';
import { Col } from 'patternfly-react';
import ReduxVerticalFormGroup from '../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import validators from '../../../common/validators';
import constants, { NetworkConfugurationHint, RouterShardsHint } from './CreateOSDClusterHelper';

function RouterShardsForm(props) {
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
        <h4>{constants.routerShardsHeader}</h4>
        <FormSection name="network_router_shards">
          <Field
            component={ReduxVerticalFormGroup}
            name="0.label"
            label=""
            placeholder="Label"
            type="text"
            normalize={val => val.toLowerCase()}
            disabled={pending}
          />
          <Field
            component={ReduxVerticalFormGroup}
            name="1.label"
            label=""
            placeholder="Label"
            type="text"
            normalize={val => val.toLowerCase()}
            disabled={pending}
          />
        </FormSection>
      </Col>
      <Col sm={4}>
        <NetworkConfugurationHint />
        <RouterShardsHint />
      </Col>
    </React.Fragment>
  );
}

RouterShardsForm.propTypes = {
  pending: PropTypes.bool,
};

export default RouterShardsForm;
