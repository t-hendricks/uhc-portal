import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  GridItem,
} from '@patternfly/react-core';
import ReduxVerticalFormGroupPF4 from '../../../common/ReduxFormComponents/ReduxVerticalFormGroupPF4';
import validators from '../../../../common/validators';
import { constants } from '../CreateOSDClusterHelper';

function AdvancedNetworkFields(props) {
  const {
    pending,
  } = props;
  return (
    <React.Fragment>
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroupPF4}
          name="network_machine_cidr"
          label="Node CIDR"
          placeholder="10.0.0.0/16"
          type="text"
          validate={validators.cidr}
          disabled={pending}
          extendedHelpText={constants.nodeCIDRHint}
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroupPF4}
          name="network_service_cidr"
          label="Service CIDR"
          placeholder="172.30.0.0/16"
          type="text"
          validate={validators.cidr}
          disabled={pending}
          extendedHelpText={constants.serviceCIDRHint}
        />
      </GridItem>
      <GridItem span={8} />
      <GridItem span={4}>
        <Field
          component={ReduxVerticalFormGroupPF4}
          name="network_pod_cidr"
          label="Pod CIDR"
          placeholder="10.128.0.0/14"
          type="text"
          validate={validators.cidr}
          disabled={pending}
          extendedHelpText={constants.podCIDRHint}
        />
      </GridItem>
    </React.Fragment>
  );
}

AdvancedNetworkFields.propTypes = {
  pending: PropTypes.bool,
};

export default AdvancedNetworkFields;
