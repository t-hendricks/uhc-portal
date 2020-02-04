import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { GridItem, FormGroup } from '@patternfly/react-core';

import { constants } from '../CreateOSDFormConstants';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import validators from '../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function NetworkingSection({ pending, toggleNetwork, mode }) {
  return (
    <>
      <FormGroup
        label="Network configuration"
        isRequired
        fieldId="network-configuration-toggle"
      >
        <Field
          component={RadioButtons}
          className="network-configuration-radios"
          name="network-configuration-toggle"
          disabled={pending}
          onChange={toggleNetwork}
          options={[{
            value: 'basic',
            ariaLabel: 'Advanced',
            label: (
              <>
                Basic
                <div className="radio-helptext">Creates a new VPC for your cluster using default values</div>
              </>),
          },
          {
            value: 'advanced',
            ariaLabel: 'Advanced',
            label: (
              <>
                Advanced
                <div className="radio-helptext">Allow clusters to use a new VPC with customizable addresses</div>
              </>
            ),
          }]}
          defaultValue="basic"
        />
      </FormGroup>
      <GridItem span={8} />
      { mode === 'advanced'
        && (
          <>
            <GridItem span={4}>
              <Field
                component={ReduxVerticalFormGroup}
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
                component={ReduxVerticalFormGroup}
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
                component={ReduxVerticalFormGroup}
                name="network_pod_cidr"
                label="Pod CIDR"
                placeholder="10.128.0.0/14"
                type="text"
                validate={validators.cidr}
                disabled={pending}
                extendedHelpText={constants.podCIDRHint}
              />
            </GridItem>
          </>
        )}
    </>
  );
}

NetworkingSection.propTypes = {
  pending: PropTypes.bool,
  mode: PropTypes.string,
  toggleNetwork: PropTypes.func,
};

export default NetworkingSection;
