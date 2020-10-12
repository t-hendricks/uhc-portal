import { userActions } from './userActions';
import { accountsService } from '../../services';

jest.mock('../../services/accountsService.js');

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
      clusterQuota = {
        aws: {
          byoc: {
            singleAz: { available: 0 },
            multiAz: { available: 0 },
            totalAvailable: 0,
          },
          rhInfra: {
            singleAz: { available: 0 },
            multiAz: { available: 0 },
            totalAvailable: 0,
          },
        },
        gcp: {
          rhInfra: {
            singleAz: { available: 0 },
            multiAz: { available: 0 },
            totalAvailable: 0,
          },
        },
      };
    });

    it('should process quota for basic OSD on AWS', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota.aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.rhInfra.totalAvailable).toEqual(1);
    });

    it('should process quota for basic OSD on AWS and byoc', () => {
      const resources = [
        {
          cloud_provider: 'aws',
          byoc: 'rhinfra',
          availability_zone_type: 'single',
          resource_name: 'gp.small',
        },
        {
          cloud_provider: 'any',
          resource_name: 'mem.small',
          resource_type: 'cluster',
          byoc: 'byoc',
          availability_zone_type: 'single',
          product: 'OSD',
        },
      ];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota.aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota.aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.byoc.totalAvailable).toEqual(1);
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        cloud_provider: 'any',
        byoc: 'rhinfra',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota.aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.rhInfra.totalAvailable).toEqual(1);
      expect(clusterQuota.gcp.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.gcp.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota.gcp.rhInfra.totalAvailable).toEqual(1);
    });

    it('should process quota for any infrastructure', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'any',
        availability_zone_type: 'single',
        resource_name: 'gp.small',
        cost: 1,
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota.aws.byoc.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.byoc.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.byoc.totalAvailable).toEqual(1);
      expect(clusterQuota.aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.rhInfra.totalAvailable).toEqual(1);
    });

    it('should process quota for any availability zone', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        availability_zone_type: 'any',
        resource_name: 'gp.small',
      }];
      userActions.processClusterQuota(clusterQuota, item, resources);
      expect(clusterQuota.aws.rhInfra.singleAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.rhInfra.singleAz.available).toEqual(1);
      expect(clusterQuota.aws.rhInfra.multiAz['gp.small']).toEqual(1);
      expect(clusterQuota.aws.rhInfra.multiAz.available).toEqual(1);
      expect(clusterQuota.aws.rhInfra.totalAvailable).toEqual(1);
    });
  });

  describe('processNodeQuota', () => {
    let nodesQuota;
    beforeEach(() => {
      nodesQuota = {
        aws: { byoc: {}, rhInfra: {} },
        gcp: { rhInfra: {} },
      };
    });

    it('should process quota for OSD compute nodes on AWS', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
        cost: 1,
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota.aws.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for OSD compute nodes on AWS and byoc', () => {
      const resources = [
        {
          cloud_provider: 'aws',
          byoc: 'rhinfra',
          resource_name: 'gp.small',
          cost: 1,
        },
        {
          cloud_provider: 'any',
          resource_name: 'cpu.large',
          resource_type: 'compute.node',
          byoc: 'byoc',
          availability_zone_type: 'any',
          product: 'OSD',
          cost: 1,
        },
      ];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota.aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota.aws.byoc['cpu.large'].available).toEqual(1);
    });

    it('should process quota for any cloud provider', () => {
      const resources = [{
        cloud_provider: 'any',
        byoc: 'rhinfra',
        resource_name: 'gp.small',
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota.aws.rhInfra['gp.small'].available).toEqual(1);
      expect(nodesQuota.gcp.rhInfra['gp.small'].available).toEqual(1);
    });

    it('should process quota for any infrastructure', () => {
      const resources = [{
        cloud_provider: 'aws',
        byoc: 'any',
        resource_name: 'gp.small',
      }];
      userActions.processNodeQuota(nodesQuota, item, resources);
      expect(nodesQuota.aws.byoc['gp.small'].available).toEqual(1);
      expect(nodesQuota.aws.rhInfra['gp.small'].available).toEqual(1);
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
