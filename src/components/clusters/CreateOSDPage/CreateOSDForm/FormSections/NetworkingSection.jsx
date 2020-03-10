import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import { GridItem, FormGroup } from '@patternfly/react-core';

import { constants } from '../CreateOSDFormConstants';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import validators from '../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function NetworkingSection({ pending, toggleNetwork, mode }) {
  const formatHostPrefix = (value) => {
    if (value && value.charAt(0) !== '/') {
      return `/${value}`;
    }
    return value;
  };

  const normalizeHostPrefix = (value) => {
    if (value && value.charAt(0) === '/') {
      return value.substring(1);
    }
    return value;
  };

  return (
    <>
      <FormGroup
        label="Network configuration"
        isRequired
        fieldId="network_configuration_toggle"
      >
        <Field
          component={RadioButtons}
          className="radio-button"
          name="network_configuration_toggle"
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
      { mode === 'advanced'
        && (
          <>
            <GridItem span={4}>
              <Field
                component={ReduxVerticalFormGroup}
                name="network_machine_cidr"
                label="Machine CIDR"
                placeholder="10.0.0.0/16"
                type="text"
                validate={[validators.cidr, validators.machineCidr]}
                disabled={pending}
                extendedHelpText={constants.machineCIDRHint}
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
                validate={[validators.cidr, validators.serviceCidr]}
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
                validate={[validators.cidr, validators.podCidr]}
                disabled={pending}
                extendedHelpText={constants.podCIDRHint}
              />
            </GridItem>
            <GridItem span={8} />
            <GridItem span={4}>
              <Field
                component={ReduxVerticalFormGroup}
                name="network_host_prefix"
                label="Host Prefix"
                placeholder="/23"
                type="text"
                format={formatHostPrefix}
                normalize={normalizeHostPrefix}
                validate={validators.hostPrefix}
                disabled={pending}
                extendedHelpText={constants.hostPrefixHint}
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
