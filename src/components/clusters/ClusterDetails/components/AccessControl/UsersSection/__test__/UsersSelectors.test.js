import canAllowAdminSelector from '../UsersSelector';
import clusterStates from '../../../../../common/clusterStates';


describe('canAllowAdminSelector', () => {
  it('should return false when user has no capability to allow cluster admins', () => {
    const stateWithNoCapability = {
      clusters: {
        details: {
          cluster: {
            state: clusterStates.READY,
            product: { id: 'osd' },
            subscription: {
              capabilities: [
                { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: true },
                { name: 'capability.cluster.manage_cluster_admin', value: 'false', inherited: false },
              ],
            },
          },
        },
      },
    };

    const result = canAllowAdminSelector(stateWithNoCapability);

    expect(result).toBe(false);
  });

  it('should return false when cluster is not ready', () => {
    const stateWithNoCapability = {
      clusters: {
        details: {
          cluster: {
            state: clusterStates.INSTALLING,
            subscription: {
              capabilities: [],
            },
          },
        },
      },
    };

    const result = canAllowAdminSelector(stateWithNoCapability);

    expect(result).toBe(false);
  });

  it('should return false for rhmi', () => {
    const stateWithNoCapability = {
      clusters: {
        details: {
          cluster: {
            state: clusterStates.READY,
            product: { id: 'rhmi' },
            subscription: {
              capabilities: [
                { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: true },
                { name: 'capability.cluster.manage_cluster_admin', value: 'false', inherited: false },
              ],
            },
          },
        },
      },
    };

    const result = canAllowAdminSelector(stateWithNoCapability);

    expect(result).toBe(false);
  });

  it('should return true when user has capability to allow cluster admins', () => {
    const stateWithCapability = {
      clusters: {
        details: {
          cluster: {
            state: clusterStates.READY,
            product: { id: 'osd' },
            subscription: {
              capabilities: [
                { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: true },
                { name: 'capability.cluster.manage_cluster_admin', value: 'true', inherited: false },
              ],
            },
          },
        },
      },
    };

    const result = canAllowAdminSelector(stateWithCapability);

    expect(result).toBe(true);
  });

  it('should allow adding cluster admins for ccs clusters', () => {
    const stateWithCapability = {
      clusters: {
        details: {
          cluster: {
            state: clusterStates.READY,
            ccs: { enabled: true },
            product: { id: 'osd' },
            subscription: {
              capabilities: [
                { name: 'capability.cluster.subscribed_ocp', value: 'true', inherited: true },
                { name: 'capability.cluster.manage_cluster_admin', value: 'true', inherited: false },
              ],
            },
          },
        },
      },
    };

    const result = canAllowAdminSelector(stateWithCapability);

    expect(result).toBe(true);
  });
});
