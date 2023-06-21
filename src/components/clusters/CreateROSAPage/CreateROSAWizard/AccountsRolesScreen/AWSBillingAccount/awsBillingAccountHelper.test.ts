import { hasContract, getDimensionValue } from './awsBillingAccountHelper';

const dataWithCpuTime = {
  cloud_account_id: '123',
  cloud_provider_id: 'aws',
  contracts: [
    {
      dimensions: [
        {
          name: 'four_vcpu_hour',
          value: 1,
        },
      ],
      end_date: 'some-date',
      start_date: 'some-other-date',
    },
  ],
};

describe('hasContract', () => {
  it('should find contract if cpu time is pre-purchased', () => {
    expect(hasContract(dataWithCpuTime)).toBe(true);
  });
  it('should find contract if control planes are pre-purchased', () => {
    const dataWithControlPlane = {
      cloud_account_id: '123',
      cloud_provider_id: 'aws',
      contracts: [
        {
          dimensions: [
            {
              name: 'control_plane',
              value: 2,
            },
          ],
          end_date: 'some-date',
          start_date: 'some-other-date',
        },
      ],
    };
    expect(hasContract(dataWithControlPlane)).toBe(true);
  });
  it('should not find contract if only premium support is pre-purchased', () => {
    const dataWithSupportOnly = {
      cloud_account_id: '123',
      cloud_provider_id: 'aws',
      contracts: [
        {
          dimensions: [
            {
              name: 'premium_support',
              value: 1,
            },
          ],
          end_date: 'some-date',
          start_date: 'some-other-date',
        },
      ],
    };
    expect(hasContract(dataWithSupportOnly)).toBe(false);
  });
  it('should not find any contract', () => {
    const dataWithSupportOnly = {
      cloud_account_id: '123',
      cloud_provider_id: 'aws',
      contracts: [],
    };
    expect(hasContract(dataWithSupportOnly)).toBe(false);
  });

  describe('getDimensionValue', () => {
    it('should return the correct value if the resource exists', () => {
      expect(getDimensionValue(dataWithCpuTime.contracts[0].dimensions, 'four_vcpu_hour')).toBe(1);
    });
    it('should return 0 if the resource does not exist', () => {
      expect(getDimensionValue(dataWithCpuTime.contracts[0].dimensions, 'control_plane')).toBe(0);
    });
  });
});
