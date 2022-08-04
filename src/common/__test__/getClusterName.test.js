import getClusterName from '../getClusterName';

describe('getClusterName', () => {
  it('gets display_name from subscription when present', () => {
    const cluster = {
      name: 'wrong',
      external_id: 'not this one',
      subscription: { display_name: 'yes' },
    };
    expect(getClusterName(cluster)).toEqual('yes');
  });

  it('ignores cluster.display_name even if present', () => {
    const cluster = { display_name: 'deprecated', name: 'yes', external_id: 'not this one' };
    expect(getClusterName(cluster)).toEqual('yes');
  });

  it('uses name from cluster when subscription.display_name is not present', () => {
    const cluster = { name: 'yes', external_id: 'not this one' };
    expect(getClusterName(cluster)).toEqual('yes');
  });

  it('uses external_id from cluster when subscription.display_name and name are not present', () => {
    const cluster = { external_id: 'yes' };
    expect(getClusterName(cluster)).toEqual('yes');
  });

  it('uses subscription_id from cluster when the subscription status is deprovisioned', () => {
    const cluster = {
      subscription: {
        id: 'yes',
        status: 'Deprovisioned',
      },
    };
    expect(getClusterName(cluster)).toEqual('yes');
  });

  it('returns "Unnamed Cluster" when no other info is present', () => {
    expect(getClusterName({})).toEqual('Unnamed Cluster');
  });
});
