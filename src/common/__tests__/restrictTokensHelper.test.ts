import { hasRestrictTokensCapability } from '../restrictTokensHelper';

describe('restrict tokens capability', () => {
  it('should return true if org has restrict offline tokens capability', () => {
    const capabilities = [
      {
        inherited: false,
        name: 'capability.organization.enable_data_sovereign_regions',
        value: 'true',
      },
      {
        inherited: false,
        name: 'capability.organization.restrict_offline_tokens',
        value: 'true',
      },
      {
        inherited: false,
        name: 'capability.cluster.subscribed_ocp',
        value: 'true',
      },
    ];
    expect(hasRestrictTokensCapability(capabilities)).toEqual(true);
  });

  it('should return false if org does not have restrict offline tokens capability', () => {
    const capabilities = [
      {
        inherited: false,
        name: 'capability.organization.enable_data_sovereign_regions',
        value: 'true',
      },
      {
        inherited: false,
        name: 'capability.cluster.subscribed_ocp',
        value: 'true',
      },
    ];
    expect(hasRestrictTokensCapability(capabilities)).toEqual(false);
  });
});
