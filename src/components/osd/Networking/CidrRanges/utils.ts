import { FormikValues } from 'formik';
import validators, { required } from '~/common/validators';
import { CloudProviderType } from '../../ClusterSettings/CloudProvider/types';
import { FieldId } from '../../constants';

const machineDisjointSubnets = validators.disjointSubnets(FieldId.NetworkMachineCidr);
const serviceDisjointSubnets = validators.disjointSubnets(FieldId.NetworkServiceCidr);
const podDisjointSubnets = validators.disjointSubnets(FieldId.NetworkPodCidr);
const awsMachineSingleAZSubnetMask = validators.awsSubnetMask(FieldId.NetworkMachineCidrSingleAz);
const awsMachineMultiAZSubnetMask = validators.awsSubnetMask(FieldId.NetworkMachineCidrMultiAz);
const awsServiceSubnetMask = validators.awsSubnetMask(FieldId.NetworkServiceCidr);

export const validateCidr = (value: string) => (cloudProvider: CloudProviderType) =>
  required(value) ||
  validators.cidr(value) ||
  validators.validateRange(value) ||
  validators.disjointFromDockerRange(value) ||
  (cloudProvider === CloudProviderType.Gcp && validators.privateAddress(value)) ||
  undefined;

export const validateMachineCidr = (value: string) => (values: FormikValues) => {
  const { [FieldId.CloudProvider]: cloudProvider, [FieldId.MultiAz]: multiAz } = values;
  const isMultiAz = multiAz === 'true';

  return (
    validateCidr(value)(cloudProvider) ||
    (cloudProvider === CloudProviderType.Aws && validators.awsMachineCidr(value, values)) ||
    validators.validateRange(value) ||
    machineDisjointSubnets(value, values) ||
    (cloudProvider === CloudProviderType.Aws &&
      !isMultiAz &&
      awsMachineSingleAZSubnetMask(value)) ||
    (cloudProvider === CloudProviderType.Aws && isMultiAz && awsMachineMultiAZSubnetMask(value)) ||
    undefined
  );
};

export const validateServiceCidr = (value: string) => (values: FormikValues) => {
  const { [FieldId.CloudProvider]: cloudProvider } = values;

  return (
    validateCidr(value)(cloudProvider) ||
    validators.serviceCidr(value) ||
    serviceDisjointSubnets(value, values) ||
    (cloudProvider === CloudProviderType.Aws && awsServiceSubnetMask(value)) ||
    undefined
  );
};

export const validatePodrCidr = (value: string) => (values: FormikValues) =>
  validateCidr(value)(values[FieldId.CloudProvider]) ||
  validators.podCidr(value, values) ||
  podDisjointSubnets(value, values) ||
  undefined;

export const formatHostPrefix = (value: string) => {
  if (value && value.charAt(0) !== '/') {
    return `/${value}`;
  }

  return value;
};
