import { hasSelectedSecurityGroups } from './securityGroupsHelpers';

describe('hasSelectedSecurityGroups', () => {
  describe('when controlPlane groups apply to all node types', () => {
    it('returns true when at least one controlPlane group is selected', () => {
      const sgs = {
        applyControlPlaneToAll: true,
        controlPlane: ['sg-abc'],
        worker: [],
        infra: [],
      };
      expect(hasSelectedSecurityGroups(sgs)).toEqual(true);
    });
    it('returns false when no controlPlane groups are selected', () => {
      const sgs = {
        applyControlPlaneToAll: true,
        controlPlane: [],
        worker: ['sg-this-group-will-be-ignored'],
        infra: [],
      };
      expect(hasSelectedSecurityGroups(sgs)).toEqual(false);
    });
  });

  describe('when each node type defines its own groups', () => {
    it('returns true when there is at least one security group for controlPlane nodes', () => {
      const sgs = {
        applyControlPlaneToAll: false,
        controlPlane: [],
        worker: [],
        infra: ['sg-abc'],
      };
      expect(hasSelectedSecurityGroups(sgs)).toEqual(true);
    });
    it('returns true when there is at least one security group for infra nodes', () => {
      const sgs = {
        applyControlPlaneToAll: false,
        controlPlane: [],
        worker: [],
        infra: ['sg-abc'],
      };
      expect(hasSelectedSecurityGroups(sgs)).toEqual(true);
    });
    it('returns true when there is at least one security group for worker nodes', () => {
      const sgs = {
        applyControlPlaneToAll: false,
        controlPlane: [],
        worker: [],
        infra: ['sg-abc'],
      };
      expect(hasSelectedSecurityGroups(sgs)).toEqual(true);
    });
    it('returns true when none of the node types has any security groups', () => {
      const sgs = {
        applyControlPlaneToAll: false,
        controlPlane: [],
        worker: [],
        infra: [],
      };
      expect(hasSelectedSecurityGroups(sgs)).toEqual(false);
    });
  });
});
