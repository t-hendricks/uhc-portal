import canEnableEtcdSelector from '../CreateOsdPageSelectors';

describe('canEnableEtcdSelector', () => {
  it('should return false when user has no capability to enable etcd encryption', () => {
    const stateWithNoCapability = {
      userProfile: {
        organization: {
          details: {
            capabilities: [
              { name: 'capability.account.create_moa_clusters', value: 'true', inherited: false },
              { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
              { name: 'capability.account.enable_terms_enforcement', value: 'true', inherited: false },
            ],
          },
        },
      },
    };

    const result = canEnableEtcdSelector(stateWithNoCapability);

    expect(result).toBe(false);
  });

  it('should return true when user has capability to enable etcd encryption', () => {
    const stateWithCapability = {
      userProfile: {
        organization: {
          details: {
            capabilities: [
              { name: 'capability.account.create_moa_clusters', value: 'true', inherited: false },
              { name: 'capability.account.allow_etcd_encryption', value: 'true', inherited: false },
              { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: false },
              { name: 'capability.account.enable_terms_enforcement', value: 'true', inherited: false },
            ],
          },
        },
      },
    };

    const result = canEnableEtcdSelector(stateWithCapability);

    expect(result).toBe(true);
  });
});
