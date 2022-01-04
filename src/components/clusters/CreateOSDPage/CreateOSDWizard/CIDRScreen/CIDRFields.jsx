import PropTypes from 'prop-types';
import React from 'react';
import { Field } from 'redux-form';
import {
  GridItem, Alert, List, ListItem,
} from '@patternfly/react-core';

import { constants } from '../../CreateOSDForm/CreateOSDFormConstants';
import validators from '../../../../../common/validators';
import ReduxVerticalFormGroup from '../../../../common/ReduxFormComponents/ReduxVerticalFormGroup';

import {
  MACHINE_CIDR_PLACEHOLDER,
  SERVICE_CIDR_PLACEHOLDER,
  HOST_PREFIX_PLACEHOLDER,
  podCidrPlaceholder,
} from '../../CreateOSDForm/FormSections/NetworkingSection/networkingPlaceholders';

import '../../CreateOSDForm/FormSections/NetworkingSection/SubnetFields.scss';

const machineDisjointSubnets = validators.disjointSubnets('network_machine_cidr');
const serviceDisjointSubnets = validators.disjointSubnets('network_service_cidr');
const podDisjointSubnets = validators.disjointSubnets('network_pod_cidr');
const awsMachineSingleAZSubnetMask = validators.awsSubnetMask('network_machine_cidr_single_az');
const awsMachineMultiAZSubnetMask = validators.awsSubnetMask('network_machine_cidr_multi_az');
const awsServiceSubnetMask = validators.awsSubnetMask('network_service_cidr');

function CIDRFields({
  disabled,
  cloudProviderID,
  isMultiAz,
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

  const privateRangesHint = cloudProviderID === 'gcp' ? (
    <>
      <br />
      <span>
        The address must be a private IPv4 address, belonging to one of the
        following ranges:
        <List>
          <ListItem>10.0.0.0 – 10.255.255.255</ListItem>
          <ListItem>172.16.0.0 – 172.31.255.255</ListItem>
          <ListItem>192.168.0.0 – 192.168.255.255</ListItem>
        </List>
      </span>
    </>
  ) : null;

  return (
    <>
      <GridItem>
        <Alert
          id="advanced-networking-alert"
          isInline
          variant="info"
          title="CIDR ranges may not be changed once the cluster has been created."
        >
          Specify non-overlapping ranges for machine, service, and pod ranges.
          Each range should correspond to the first IP address in their subnet.
          The below values are safe defaults; however you must at least ensure that the
          Machine CIDR is valid for your chosen subnet(s).
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
          disabled={disabled}
          helpText={cloudProviderID === 'aws' ? `Subnet mask must be between /${validators.AWS_MACHINE_CIDR_MIN} and /${awsMachineCIDRMax}.` : `Range must be private. Subnet mask must be at most /${validators.GCP_MACHINE_CIDR_MAX}.`}
          extendedHelpText={(
            <>
              {constants.machineCIDRHint}
              {privateRangesHint}
            </>
          )}
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
          disabled={disabled}
          helpText={cloudProviderID === 'aws' ? `Subnet mask must be at most /${validators.SERVICE_CIDR_MAX}.` : `Range must be private. Subnet mask must be at most /${validators.SERVICE_CIDR_MAX}.`}
          extendedHelpText={(
            <>
              {constants.serviceCIDRHint}
              {privateRangesHint}
            </>
          )}
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
          disabled={disabled}
          helpText={cloudProviderID === 'aws' ? `Subnet mask must allow for at least ${validators.POD_NODES_MIN} nodes.` : `Range must be private. Subnet mask must allow for at least ${validators.POD_NODES_MIN} nodes.`}
          extendedHelpText={(
            <>
              {constants.podCIDRHint}
              {privateRangesHint}
            </>
          )}
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
          disabled={disabled}
          helpText={`Must be between /${validators.HOST_PREFIX_MIN} and /${validators.HOST_PREFIX_MAX}.`}
          extendedHelpText={constants.hostPrefixHint}
          showHelpTextOnError={false}
        />
      </GridItem>
    </>
  );
}

CIDRFields.propTypes = {
  disabled: PropTypes.bool,
  cloudProviderID: PropTypes.string,
  isMultiAz: PropTypes.bool,
};

export default CIDRFields;
