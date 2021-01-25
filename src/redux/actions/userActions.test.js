import { userActions } from './userActions';
import { accountsService } from '../../services';
import { normalizedProducts } from '../../common/subscriptionTypes';

jest.mock('../../services/accountsService.js');

// See also quotaSelectors.test.js checking processQuota -> selectors together.

const { OCP } = normalizedProducts;
const { OSD } = normalizedProducts;
const { OSDTrial } = normalizedProducts;

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
      expect(clusterQuota[OSD].aws.rhInfra.singleAz).not.toContain('gp.small');
      expect(clusterQuota[OSD].aws.rhInfra.singleAz.available).toEqual(0);
      expect(clusterQuota[OSD].aws.rhInfra.totalAvailable).toEqual(0);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(false);
    });

    it('should process quota for basic OSD on AWS', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        product: OSD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[OSD].gcp.isAvailable).toEqual(false);
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
          cost: 1,
        },
        {
          resource_type: 'cluster',
          cloud_provider: 'aws',
          resource_name: 'mem.small',
          byoc: 'byoc',
          availability_zone_type: 'single',
          product: OSD,
          cost: 1,
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[OSD].gcp.isAvailable).toEqual(false);
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
          cost: 1,
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[OCP].aws.isAvailable).toEqual(false);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(false);
      expect(clusterQuota[OSDTrial].aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[OSDTrial].aws.byoc.singleAz['cpu.large']).toEqual(1);
      expect(clusterQuota[OSDTrial].aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[OSDTrial].aws.isAvailable).toEqual(true);
      expect(clusterQuota[OSDTrial].gcp.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[OSDTrial].gcp.byoc.singleAz['cpu.large']).toEqual(1);
      expect(clusterQuota[OSDTrial].gcp.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[OSDTrial].gcp.isAvailable).toEqual(true);
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
          cost: 1,
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      [OCP, OSD, OSDTrial].forEach((product) => {
        expect(clusterQuota[product].aws.byoc.singleAz['cpu.large']).toEqual(1);
        expect(clusterQuota[product].aws.byoc.singleAz.available).toEqual(1);
        expect(clusterQuota[product].aws.byoc.multiAz.available).toEqual(0);
        expect(clusterQuota[product].aws.byoc.totalAvailable).toEqual(1);
        expect(clusterQuota[product].aws.isAvailable).toEqual(true);
        expect(clusterQuota[product].gcp.isAvailable).toEqual(false);
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
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[OSD].gcp.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].gcp.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].gcp.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].gcp.isAvailable).toEqual(true);
    });

    it('should process quota for any infrastructure', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'aws',
        byoc: 'any',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        product: OSD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[OSD].aws.byoc.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[OSD].gcp.isAvailable).toEqual(false);
    });

    it('should process quota for any availability zone', () => {
      const resources = [{
        resource_type: 'cluster',
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        availability_zone_type: 'any',
        resource_name: 'gp.small',
        product: OSD,
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.multiAz['gp.small']).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.multiAz.available).toEqual(1);
      expect(clusterQuota[OSD].aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota[OSD].aws.isAvailable).toEqual(true);
      expect(clusterQuota[OSD].gcp.isAvailable).toEqual(false);
    });
  });

  describe('processNodeQuota', () => {
    let nodesQuota;
    beforeEach(() => {
      nodesQuota = {
        // not all products, just enough for test.
        [OSD]: {
          aws: { byoc: {}, rhInfra: {} },
          gcp: { rhInfra: {} },
        },
        [OCP]: {
          aws: { byoc: {}, rhInfra: {} },
          gcp: { rhInfra: {} },
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
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[OSD].aws.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for OSD compute nodes on AWS and byoc', () => {
      const resources = [
        {
          resource_type: 'compute.node',
          cloud_provider: 'aws',
          byoc: 'rhinfra',
          resource_name: 'gp.small',
          product: OSD,
          cost: 1,
        },
        {
          resource_type: 'compute.node',
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          byoc: 'byoc',
          availability_zone_type: 'any',
          product: OSD,
          cost: 1,
        },
      ];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[OSD].aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota[OSD].aws.byoc['cpu.large'].available).toEqual(1);
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        resource_type: 'compute.node',
        cloud_provider: 'any',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
        product: OSD,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[OSD].aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota[OSD].gcp.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for any infrastructure', () => {
      const resources = [{
        resource_type: 'compute.node',
        cloud_provider: 'aws',
        byoc: 'any',
        resource_name: 'gp.small',
        product: OSD,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[OSD].aws.byoc['gp.small'].available).toEqual(1);
      expect(nodesQuota[OSD].aws.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for any product', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
        product: normalizedProducts.ANY,
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota[OSD].aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota[OCP].aws.rhInfra['gp.small'].available).toEqual(1);
    });
  });

  describe('processStorageQuota', () => {
    let storageQuota;
    beforeEach(() => {
      storageQuota = {
        aws: { available: 0 },
        gcp: { available: 0 },
      };
    });

    it('should process quota on AWS', () => {
      const resources = [{
        cloud_provider: 'aws',
      }];
      userActions.processStorageQuota(storageQuota, item, resources);
      expect(storageQuota.aws.available).toEqual(1);
      expect(storageQuota.gcp.available).toEqual(0);
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        cloud_provider: 'any',
      }];
      userActions.processStorageQuota(storageQuota, item, resources);
      expect(storageQuota.aws.available).toEqual(1);
      expect(storageQuota.gcp.available).toEqual(1);
    });
  });

  describe('processLoadBalancerQuota', () => {
    let loadBalancerQuota;
    beforeEach(() => {
      loadBalancerQuota = {
        aws: { available: 0 },
        gcp: { available: 0 },
      };
    });

    it('should process quota on AWS', () => {
      const resources = [{
        cloud_provider: 'aws',
      }];
      userActions.processLoadBalancerQuota(loadBalancerQuota, item, resources);
      expect(loadBalancerQuota.aws.available).toEqual(1);
      expect(loadBalancerQuota.gcp.available).toEqual(0);
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        cloud_provider: 'any',
      }];
      userActions.processLoadBalancerQuota(loadBalancerQuota, item, resources);
      expect(loadBalancerQuota.aws.available).toEqual(1);
      expect(loadBalancerQuota.gcp.available).toEqual(1);
    });
  });

  describe('processAddOnQuota', () => {
    let addOnsQuota;
    beforeEach(() => {
      addOnsQuota = {};
    });

    it('should process quota', () => {
      const resources = [{
        resource_name: 'fake-addon',
      }];
      userActions.processAddOnQuota(addOnsQuota, item, resources);
      expect(addOnsQuota['fake-addon']).toEqual(1);
    });
  });
});
