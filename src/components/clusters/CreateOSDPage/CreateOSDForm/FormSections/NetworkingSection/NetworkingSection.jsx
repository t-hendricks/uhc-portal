import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  GridItem, FormGroup, Title, Alert,
} from '@patternfly/react-core';

import { constants } from '../../CreateOSDFormConstants';
import links from '../../../../../../common/installLinks';
import validators from '../../../../../../common/validators';
import ExternalLink from '../../../../../common/ExternalLink';
import RadioButtons from '../../../../../common/ReduxFormComponents/RadioButtons';
import ReduxCheckbox from '../../../../../common/ReduxFormComponents/ReduxCheckbox';
import ReduxVerticalFormGroup from '../../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';
import InstallToVPC from './InstallToVPC';

import {
  MACHINE_CIDR_PLACEHOLDER,
  SERVICE_CIDR_PLACEHOLDER,
  HOST_PREFIX_PLACEHOLDER,
  podCidrPlaceholder,
} from './networkingPlaceholders';

const machineDisjointSubnets = validators.disjointSubnets('network_machine_cidr');
const serviceDisjointSubnets = validators.disjointSubnets('network_service_cidr');
const podDisjointSubnets = validators.disjointSubnets('network_pod_cidr');
const awsMachineSingleAZSubnetMask = validators.awsSubnetMask('network_machine_cidr_single_az');
const awsMachineMultiAZSubnetMask = validators.awsSubnetMask('network_machine_cidr_multi_az');
const awsServiceSubnetMask = validators.awsSubnetMask('network_service_cidr');

function NetworkingSection({
  pending,
  toggleNetwork,
  mode,
  showClusterPrivacy,
  privateClusterSelected,
  cloudProviderID,
  isMultiAz,
  isCCS,
  selectedRegion,
  installToVPCSelected,
  privateLinkSelected,
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

  const machineCidrValidators = [
    validators.cidr,
    cloudProviderID === 'aws' && validators.awsMachineCidr,
    cloudProviderID === 'gcp' && validators.gcpMachineCidr,
    validators.validateRange,
    machineDisjointSubnets,
    validators.disjointFromDockerRange,
    cloudProviderID === 'aws' && !isMultiAz && awsMachineSingleAZSubnetMask,
    cloudProviderID === 'aws' && isMultiAz && awsMachineMultiAZSubnetMask,
    cloudProviderID === 'gcp' && validators.privateAddress,
  ].filter(Boolean);

  const serviceCidrValidators = [
    validators.cidr,
    validators.serviceCidr,
    validators.validateRange,
    serviceDisjointSubnets,
    validators.disjointFromDockerRange,
    cloudProviderID === 'aws' && awsServiceSubnetMask,
    cloudProviderID === 'gcp' && validators.privateAddress,
  ].filter(Boolean);

  const podCidrValidators = [
    validators.cidr,
    validators.podCidr,
    validators.validateRange,
    podDisjointSubnets,
    validators.disjointFromDockerRange,
    cloudProviderID === 'gcp' && validators.privateAddress,
  ].filter(Boolean);

  const awsMachineCIDRMax = isMultiAz
    ? validators.AWS_MACHINE_CIDR_MAX_MULTI_AZ
    : validators.AWS_MACHINE_CIDR_MAX_SINGLE_AZ;

  return (
    <>
      <GridItem>
        <Title headingLevel="h3">Networking</Title>
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
                <div className="pf-c-radio__description">Creates a new VPC for your cluster using default values.</div>
              </>),
          },
          {
            value: 'advanced',
            ariaLabel: 'Advanced',
            label: (
              <>
                Advanced
                <div className="pf-c-radio__description">
                  Choose this option if you will ever need direct,
                  private network connectivity to your cluster, e.g. VPN or VPC peering.
                </div>
              </>
            ),
          }]}
          defaultValue="basic"
        />
      </FormGroup>
      {
        mode === 'advanced' && isCCS && (
          <>
            <GridItem>
              <Field
                component={ReduxCheckbox}
                name="install_to_vpc"
                label="Install into an existing VPC"
              />
            </GridItem>
            <InstallToVPC
              selectedRegion={selectedRegion}
              isMultiAz={isMultiAz}
              selected={installToVPCSelected}
              privateLinkSelected={privateLinkSelected}
              cloudProviderID={cloudProviderID}
            />
          </>
        )
      }
      { mode === 'advanced'
        && (
          <>
            <GridItem>
              <Alert
                id="advanced-networking-alert"
                isInline
                variant="info"
                title="CIDR ranges may not be changed once the cluster has been created."
              >
                The machine, service and pod ranges may not overlap. The addresses must specify a
                range, and correspond to the first IP address in their subnet.
                { cloudProviderID === 'gcp'
                 && (
                   <>
                     <br />
                     <span>
                       All addresses must be private IPv4 addresses, and belong to one of the
                       following ranges:
                       <ul>
                         <li>10.0.0.0 – 10.255.255.255</li>
                         <li>172.16.0.0 – 172.31.255.255</li>
                         <li>192.168.0.0 – 192.168.255.255</li>
                       </ul>
                     </span>
                   </>
                 )}
              </Alert>
            </GridItem>
            <GridItem md={6}>
              <Field
                component={ReduxVerticalFormGroup}
                name="network_machine_cidr"
                label="Machine CIDR"
                placeholder={MACHINE_CIDR_PLACEHOLDER}
                type="text"
                validate={machineCidrValidators}
                disabled={pending}
                helpText={cloudProviderID === 'aws' ? `Subnet mask must be between /${validators.AWS_MACHINE_CIDR_MIN} and /${awsMachineCIDRMax}.` : `Range must be private. Subnet mask must be at most /${validators.GCP_MACHINE_CIDR_MAX}.`}
                extendedHelpText={constants.machineCIDRHint}
                showHelpTextOnError={false}
              />
            </GridItem>
            <GridItem md={6} />
            <GridItem md={6}>
              <Field
                component={ReduxVerticalFormGroup}
                name="network_service_cidr"
                label="Service CIDR"
                placeholder={SERVICE_CIDR_PLACEHOLDER}
                type="text"
                validate={serviceCidrValidators}
                disabled={pending}
                helpText={cloudProviderID === 'aws' ? `Subnet mask must be at most /${validators.SERVICE_CIDR_MAX}.` : `Range must be private. Subnet mask must be at most /${validators.SERVICE_CIDR_MAX}.`}
                extendedHelpText={constants.serviceCIDRHint}
                showHelpTextOnError={false}
              />
            </GridItem>
            <GridItem md={6} />
            <GridItem md={6}>
              <Field
                component={ReduxVerticalFormGroup}
                name="network_pod_cidr"
                label="Pod CIDR"
                placeholder={podCidrPlaceholder(cloudProviderID)}
                type="text"
                validate={podCidrValidators}
                disabled={pending}
                helpText={cloudProviderID === 'aws' ? `Subnet mask must allow for at least ${validators.POD_NODES_MIN} nodes.` : `Range must be private. Subnet mask must allow for at least ${validators.POD_NODES_MIN} nodes.`}
                extendedHelpText={constants.podCIDRHint}
                showHelpTextOnError={false}
              />
            </GridItem>
            <GridItem md={6} />
            <GridItem md={6}>
              <Field
                component={ReduxVerticalFormGroup}
                name="network_host_prefix"
                label="Host prefix"
                placeholder={HOST_PREFIX_PLACEHOLDER}
                type="text"
                format={formatHostPrefix}
                normalize={normalizeHostPrefix}
                validate={validators.hostPrefix}
                disabled={pending}
                helpText={`Must be between /${validators.HOST_PREFIX_MIN} and /${validators.HOST_PREFIX_MAX}.`}
                extendedHelpText={constants.hostPrefixHint}
                showHelpTextOnError={false}
              />
            </GridItem>
            { showClusterPrivacy && (
              <>
                <GridItem>
                  <Title headingLevel="h4" size="xl" className="privacy-heading">Cluster privacy</Title>
                </GridItem>
                <GridItem>
                  <p>
                    Clusters may be created initially with control plane API endpoint
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
                        <div className="pf-c-radio__description">Control plane API endpoint and application routes are accessible from the internet.</div>
                      </>),
                    disabled: privateLinkSelected,
                  },
                  {
                    value: 'internal',
                    ariaLabel: 'Private',
                    label: (
                      <>
                        Private
                        <div className="pf-c-radio__description">
                          Control plane API endpoint and application routes are restricted to
                          direct, private connectivity.
                        </div>
                      </>
                    ),
                  }]}
                  defaultValue={privateLinkSelected ? 'internal' : 'external'}
                />
                {privateClusterSelected && (
                <GridItem>
                  <Alert className="bottom-alert" variant="warning" isInline title="You will not be able to access your cluster until you edit network settings in your cloud provider.">
                    {cloudProviderID === 'aws'
                      && (
                      <span>
                        Follow the
                        {' '}
                        <ExternalLink href={links.OSD_UNDERSTANDING_AWS}>
                          documentation
                        </ExternalLink>
                        {' '}
                        for how to do that.
                      </span>
                      )}
                  </Alert>
                </GridItem>
                )}
              </>
            )}
          </>
        )}
    </>
  );
}

NetworkingSection.defaultProps = {
  isCCS: false,
};

NetworkingSection.propTypes = {
  pending: PropTypes.bool,
  mode: PropTypes.string,
  toggleNetwork: PropTypes.func,
  showClusterPrivacy: PropTypes.bool,
  privateClusterSelected: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
  isCCS: PropTypes.bool,
  selectedRegion: PropTypes.string,
  installToVPCSelected: PropTypes.bool,
  privateLinkSelected: PropTypes.bool,
};

export default NetworkingSection;
