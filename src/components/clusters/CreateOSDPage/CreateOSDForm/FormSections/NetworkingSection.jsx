import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  GridItem, FormGroup, Title, Alert,
} from '@patternfly/react-core';

import { constants } from '../CreateOSDFormConstants';
import RadioButtons from '../../../../common/ReduxFormComponents/RadioButtons';
import validators from '../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

function NetworkingSection({
  pending,
  toggleNetwork,
  mode,
  showClusterPrivacy,
  privateClusterSelected,
}) {
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
      <GridItem span={4}>
        <Title headingLevel="h4" size="xl">Networking</Title>
      </GridItem>
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
                <div className="radio-helptext">Creates a new VPC for your cluster using default values.</div>
              </>),
          },
          {
            value: 'advanced',
            ariaLabel: 'Advanced',
            label: (
              <>
                Advanced
                <div className="radio-helptext">
                  Choose this option if you will ever need direct, private network connectivity
                  to your cluster, e.g. VPN, VPC peering, DirectConnect or TransitGateway.
                </div>
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
                helpText="Cannot be changed once set."
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
                helpText="Cannot be changed once set."
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
                helpText="Cannot be changed once set."
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
                helpText="Cannot be changed once set."
                extendedHelpText={constants.hostPrefixHint}
              />
            </GridItem>
            { showClusterPrivacy && (
              <>
                <Title headingLevel="h4" size="xl" className="privacy-heading">Cluster privacy</Title>
                <GridItem span={8}>
                  <p>
                  Clusters may be created initially with master API endpoint
                  and application routes being all public or all private.
                  More options are available after the initial installation.
                  </p>
                </GridItem>
                <Field
                  component={RadioButtons}
                  name="cluster_privacy"
                  ariaLabel="Cluster privacy"
                  disabled={pending}
                  options={[{
                    value: 'external',
                    ariaLabel: 'Public',
                    label: (
                      <>
                  Public (recommended)
                        <div className="radio-helptext">Master API endpoint and application routes are accessible from the internet.</div>
                      </>),
                  },
                  {
                    value: 'internal',
                    ariaLabel: 'Private',
                    label: (
                      <>
                      Private
                        <div className="radio-helptext">
                        Master API endpoint and application routes are restricted to direct,
                        private connectivity.
                        </div>
                      </>
                    ),
                  }]}
                  defaultValue="external"
                />
                {privateClusterSelected && (
                <Alert className="buttom-alert" variant="warning" isInline title="You will not be able to access your cluster until you edit network settings in your cloud provider.">
                  Follow the
                  {' '}
                  <a rel="noreferrer noopener" target="_blank" href="https://docs.openshift.com/dedicated/4/cloud_infrastructure_access/dedicated-understanding-aws.html">documetation</a>
                  {' '}
                  for how to do that.
                </Alert>
                )}
              </>
            )}
          </>
        )}
    </>
  );
}

NetworkingSection.propTypes = {
  pending: PropTypes.bool,
  mode: PropTypes.string,
  toggleNetwork: PropTypes.func,
  showClusterPrivacy: PropTypes.bool,
  privateClusterSelected: PropTypes.bool,
};

export default NetworkingSection;
