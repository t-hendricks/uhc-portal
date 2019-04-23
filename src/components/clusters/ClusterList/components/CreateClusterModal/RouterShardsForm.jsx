import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { Col } from 'patternfly-react';
import ReduxVerticalFormGroup from '../../../../common/ReduxVerticalFormGroup';
import RouterShardInputForm from './RouterShardInputForm';
import validators from '../../../../../common/validators';
import constants, { NetworkConfugurationHint, RouterShardsHint } from './CreateClusterModalHelper';

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
        <Field
          component={ReduxVerticalFormGroup}
          componentClass={RouterShardInputForm}
          label=""
          name="network_router_shards.0"
          validate={validators.routerShard}
          disabled={pending}
        />
        <Field
          component={ReduxVerticalFormGroup}
          componentClass={RouterShardInputForm}
          label=""
          name="network_router_shards.1"
          validate={validators.routerShard}
          disabled={pending}
        />
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
