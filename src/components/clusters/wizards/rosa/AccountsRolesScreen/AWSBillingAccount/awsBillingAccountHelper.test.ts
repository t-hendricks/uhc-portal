import { getContract, getDimensionValue } from './awsBillingAccountHelper';

const getTestDimensions = (testDimension: string) => [
  {
    name: 'unused dimension',
    value: '4',
  },
  {
    name: testDimension,
    value: '1',
  },
];

const getCloudAccountWithDimension = (testDimension: string) => ({
  cloud_account_id: '123',
  cloud_provider_id: 'aws',
  contracts: [
    {
      dimensions: getTestDimensions(testDimension),
      end_date: 'some-end-date',
      start_date: 'some-start-date',
    },
  ],
});

describe('getContract', () => {
  it('should find contract if cpu time is pre-purchased', () => {
    const resultContract = getContract(getCloudAccountWithDimension('four_vcpu_hour'));
    expect(resultContract?.start_date).toBe('some-start-date');
  });
  it('should find contract if control planes are pre-purchased', () => {
    const resultContract = getContract(getCloudAccountWithDimension('control_plane'));
    expect(resultContract?.start_date).toBe('some-start-date');
  });
  it('should not find contract if only premium support is pre-purchased', () => {
    const resultContract = getContract(getCloudAccountWithDimension('premium_support'));
    expect(resultContract).toBe(null);
  });
  it('should not find any contract', () => {
    const dataWithNoContracts = {
      cloud_account_id: '123',
      cloud_provider_id: 'aws',
      contracts: [],
    };
    expect(getContract(dataWithNoContracts)).toBe(null);
  });
});

describe('getDimensionValue', () => {
  it('should return the correct value if the resource exists', () => {
    const testDimensions = getTestDimensions('four_vcpu_hour');
    expect(getDimensionValue(testDimensions, 'four_vcpu_hour')).toBe('1');
  });
  it('should return 0 if the resource does not exist', () => {
    const testDimensions = getTestDimensions('four_vcpu_hour');
    expect(getDimensionValue(testDimensions, 'control_plane')).toBe(0);
  });
});
