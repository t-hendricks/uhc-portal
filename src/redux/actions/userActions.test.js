import { userActions } from './userActions';
import { accountsService } from '../../services';
import { normalizedProducts, billingModels } from '../../common/subscriptionTypes';

jest.mock('../../services/accountsService.js');

// See also quotaSelectors.test.js checking processQuota -> selectors together.

const { OCP } = normalizedProducts;
const { OSD } = normalizedProducts;
const { OSDTrial } = normalizedProducts;
const { STANDARD } = billingModels;

describe('clustersActions', () => {
  let item;
  beforeEach(() => {
    item = {
      allowed: 1,
      consumed: 0,
    };
  });

  describe('getOrganizationAndQuota', () => {
    it('calls accountsService.getCurrentAccount', () => {
      userActions.getOrganizationAndQuota();
      expect(accountsService.getCurrentAccount).toBeCalled();
    });

    it('calls accountsService.getOrganization', () => {
      userActions.getOrganizationAndQuota();
      expect(accountsService.getOrganization).toBeCalled();
    });
  });

  describe('processClusterQuota', () => {
    let clusterQuota;
    beforeEach(() => {
      clusterQuota = userActions.emptyQuota().clustersQuota;
    });

    it('should process empty quota', () => {
      const resources = [];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz).not.toContain('gp.small');
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz.available).toEqual(0);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.totalAvailable).toEqual(0);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(false);
    });

    it('should process quota for basic OSD on AWS', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[STANDARD][OSD].gcp.isAvailable).toEqual(false);
    });

    it('should process quota for basic OSD on AWS and byoc', () => {
      const resources = [
        {
          resource_type: 'cluster',
          cloud_provider: 'aws',
          byoc: 'rhinfra',
          availability_zone_type: 'single',
          resource_name: 'gp.small',
          product: OSD,
          billing_model: STANDARD,
          cost: 1,
        },
        {
          resource_type: 'cluster',
          cloud_provider: 'aws',
          resource_name: 'mem.small',
          byoc: 'byoc',
          availability_zone_type: 'single',
          product: OSD,
          billing_model: STANDARD,
          cost: 1,
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[STANDARD][OSD].gcp.isAvailable).toEqual(false);
    });

    it('should process quota for OSDTrial', () => {
      const resources = [
        {
          resource_type: 'cluster',
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          byoc: 'byoc',
          availability_zone_type: 'any',
          product: 'OSDTrial',
          billing_model: STANDARD,
          cost: 1,
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[STANDARD][OCP].aws.isAvailable).toEqual(false);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(false);
      expect(clusterQuota[STANDARD][OSDTrial].aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSDTrial].aws.byoc.singleAz['cpu.large']).toEqual(1);
      expect(clusterQuota[STANDARD][OSDTrial].aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSDTrial].aws.isAvailable).toEqual(true);
      expect(clusterQuota[STANDARD][OSDTrial].gcp.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSDTrial].gcp.byoc.singleAz['cpu.large']).toEqual(1);
      expect(clusterQuota[STANDARD][OSDTrial].gcp.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSDTrial].gcp.isAvailable).toEqual(true);
    });

    it('should process quota for any product', () => {
      const resources = [
        {
          resource_type: 'cluster',
          cloud_provider: 'aws',
          resource_name: 'cpu.large',
          byoc: 'byoc',
          availability_zone_type: 'single',
          product: normalizedProducts.ANY,
          billing_model: STANDARD,
          cost: 1,
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      [OCP, OSD, OSDTrial].forEach((product) => {
        expect(clusterQuota[STANDARD][product].aws.byoc.singleAz['cpu.large']).toEqual(1);
        expect(clusterQuota[STANDARD][product].aws.byoc.singleAz.available).toEqual(1);
        expect(clusterQuota[STANDARD][product].aws.byoc.multiAz.available).toEqual(0);
        expect(clusterQuota[STANDARD][product].aws.byoc.totalAvailable).toEqual(1);
        expect(clusterQuota[STANDARD][product].aws.isAvailable).toEqual(true);
        expect(clusterQuota[STANDARD][product].gcp.isAvailable).toEqual(false);
      });
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'any',
        byoc: 'rhinfra',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[STANDARD][OSD].gcp.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].gcp.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].gcp.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].gcp.isAvailable).toEqual(true);
    });

    it('should process quota for any infrastructure', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'aws',
        byoc: 'any',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[STANDARD][OSD].aws.byoc.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[STANDARD][OSD].gcp.isAvailable).toEqual(false);
    });

    it('should process quota for any availability zone', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        availability_zone_type: 'any',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);

      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.multiAz['gp.small']).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.multiAz.available).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[STANDARD][OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[STANDARD][OSD].gcp.isAvailable).toEqual(false);
    });
  });

  describe('processNodeQuota', () => {
    let nodesQuota;
    beforeEach(() => {
      nodesQuota = {
        standard: {
          // not all products, just enough for test.
          [OSD]: {
            aws: { byoc: {}, rhInfra: {} },
            gcp: { rhInfra: {} },
          },
          [OCP]: {
            aws: { byoc: {}, rhInfra: {} },
            gcp: { rhInfra: {} },
          },
        },
      };
    });

    it('should process quota for OSD compute nodes on AWS', () => {
      const resources = [{
        resource_type: 'compute.node',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[STANDARD][OSD].aws.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for OSD compute nodes on AWS and byoc', () => {
      const resources = [
        {
          resource_type: 'compute.node',
          cloud_provider: 'aws',
          byoc: 'rhinfra',
          resource_name: 'gp.small',
          product: OSD,
          billing_model: STANDARD,
          cost: 1,
        },
        {
          resource_type: 'compute.node',
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          byoc: 'byoc',
          availability_zone_type: 'any',
          product: OSD,
          billing_model: STANDARD,
          cost: 1,
        },
      ];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[STANDARD][OSD].aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota[STANDARD][OSD].aws.byoc['cpu.large'].available).toEqual(1);
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        resource_type: 'compute.node',
        cloud_provider: 'any',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[STANDARD][OSD].aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota[STANDARD][OSD].gcp.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for any infrastructure', () => {
      const resources = [{
        resource_type: 'compute.node',
        cloud_provider: 'aws',
        byoc: 'any',
        resource_name: 'gp.small',
        product: OSD,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[STANDARD][OSD].aws.byoc['gp.small'].available).toEqual(1);
      expect(nodesQuota[STANDARD][OSD].aws.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for any product', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
        product: normalizedProducts.ANY,
        billing_model: STANDARD,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[STANDARD][OSD].aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota[STANDARD][OCP].aws.rhInfra['gp.small'].available).toEqual(1);
    });
  });

  describe('processStorageQuota', () => {
    let storageQuota;
    beforeEach(() => {
      storageQuota = userActions.emptyQuota().storageQuota;
    });

    it('should process quota on AWS', () => {
      const resources = [{
        resource_type: 'pv.storage',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        resource_name: 'gp2',
        availability_zone_type: 'any',
        product: OSD,
        cost: 1,
      }];
      userActions.processStorageQuota(storageQuota, { allowed: 2700, consumed: 0 }, resources);
      expect(storageQuota[STANDARD][OSD].aws.rhInfra.singleAZ.gp2).toEqual(2700);
    });
  });

  describe('processLoadBalancerQuota', () => {
    let loadBalancerQuota;
    beforeEach(() => {
      loadBalancerQuota = userActions.emptyQuota().loadBalancerQuota;
    });

    it('should process quota on AWS', () => {
      const resources = [{
        resource_type: 'network.loadbalancer',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        resource_name: 'network',
        availability_zone_type: 'any',
        product: OSD,
        billing_model: 'standard',
        cost: 1,
      }];
      userActions.processLoadBalancerQuota(loadBalancerQuota,
        { allowed: 40, consumed: 0 }, resources);
      expect(loadBalancerQuota[STANDARD][OSD].aws.rhInfra.singleAZ.network).toEqual(40);
    });
  });
});
