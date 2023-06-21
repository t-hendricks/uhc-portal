import { CloudAccount } from '~/types/accounts_mgmt.v1/models/CloudAccount';
import { ContractDimension } from '~/types/accounts_mgmt.v1/models/ContractDimension';

const hasContract = (cloudAccount: CloudAccount) => {
  const { dimensions } = cloudAccount.contracts?.[0] || [];
  if (!dimensions) {
    return false;
  }
  const resources = ['control_plane', 'four_vcpu_hour'];
  return dimensions.some(
    (dimension: ContractDimension) => resources.includes(dimension.name) && dimension.value > 0,
  );
};

const getDimensionValue = (dimensions: ContractDimension[], resource: string) =>
  dimensions.find((dimension: ContractDimension) => dimension?.name === resource)?.value || 0;

export { hasContract, getDimensionValue };
