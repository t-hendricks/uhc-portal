import { vpcList } from '~/components/clusters/common/__test__/vpcs.fixtures';
import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';

import {
  SubnetPrivacy,
  filterOutRedHatManagedVPCs,
  isSubnetMatchingPrivacy,
  vpcHasRequiredSubnets,
  getMatchingAvailabilityZones,
  getSelectedAvailabilityZones,
} from './vpcHelpers';

const privatePrivacy = 'private' as SubnetPrivacy;
const publicPrivacy = 'public' as SubnetPrivacy;

describe('filterOutRedHatManagedVPCs', () => {
  it('returns only the VPCs that are not managed by Red Hat', () => {
    const filteredVPCs = filterOutRedHatManagedVPCs(vpcList);
    expect(filteredVPCs).toHaveLength(4);

    const remainingVPCNames = filteredVPCs.map((vpc) => vpc.name);
    expect(remainingVPCNames).not.toContain('jaosorior-8vns4-vpc');
    expect(remainingVPCNames).toContain('lz-p2-318-z6fst-vpc');
  });
});

describe('vpcHasPrivateSubnets', () => {
  it('returns true for a VPC that has at least 1 private subnet', () => {
    const vpcWithPrivateSubnets = vpcList.find(
      (vpc) => vpc.name === 'caa-e2e-test-vpc',
    ) as CloudVPC;
    expect(vpcHasPrivateSubnets(vpcWithPrivateSubnets)).toEqual(true);
  });

  it('returns false for a VPC that has no private subnets', () => {
    const vpcWithNoPrivateSubnets = vpcList.find(
      (vpc) => vpc.name === 'jaosorior-8vns4-vpc',
    ) as CloudVPC;
    expect(vpcHasPrivateSubnets(vpcWithNoPrivateSubnets)).toEqual(false);
  });
});

describe('isSubnetMatchingPrivacy', () => {
  it('returns true if "privacy" is unset', () => {
    const fakeSubnet = {} as Subnetwork;
    expect(isSubnetMatchingPrivacy(fakeSubnet, undefined)).toEqual(true);
  });

  it.each([
    [true, privatePrivacy, privatePrivacy],
    [false, privatePrivacy, publicPrivacy],
    [true, publicPrivacy, publicPrivacy],
    [false, publicPrivacy, privatePrivacy],
  ])(
    'returns %p if privacy is %p and subnet privacy is %p',
    (result: boolean, privacy: SubnetPrivacy, subnetPrivacy: SubnetPrivacy) => {
      const subnet = {
        public: subnetPrivacy === 'public',
      } as Subnetwork;
      expect(isSubnetMatchingPrivacy(subnet, privacy)).toEqual(result);
    },
  );
});

describe('getMatchingAvailabilityZones', () => {
  const testRegion = 'myRegion';

  describe('for "Private" privacy', () => {
    it('returns the AZs where there is at least one private subnet', () => {
      const vpc = {
        aws_subnets: [
          { subnet_id: '1', availability_zone: 'myRegiona', public: true },
          { subnet_id: '2', availability_zone: 'myRegionc', public: true },
          { subnet_id: '3', availability_zone: 'myRegione', public: false },
          { subnet_id: '4', availability_zone: 'myRegionc', public: true },
          { subnet_id: '5', availability_zone: 'myRegionb', public: false },
        ],
      } as CloudVPC;
      expect(getMatchingAvailabilityZones(testRegion, vpc, [privatePrivacy])).toEqual([
        'myRegionb',
        'myRegione',
      ]);
    });
  });

  describe('for "Public" privacy', () => {
    it('returns the AZs where there is at least one public subnet', () => {
      const vpc = {
        aws_subnets: [
          { subnet_id: '1', availability_zone: 'myRegiona', public: true },
          { subnet_id: '2', availability_zone: 'myRegionc', public: true },
          { subnet_id: '3', availability_zone: 'myRegione', public: false },
          { subnet_id: '4', availability_zone: 'myRegionc', public: true },
          { subnet_id: '5', availability_zone: 'myRegionb', public: false },
        ],
      } as CloudVPC;

      // Tests also that there's not duplicates for Region C
      expect(getMatchingAvailabilityZones(testRegion, vpc, [publicPrivacy])).toEqual([
        'myRegiona',
        'myRegionc',
      ]);
    });
  });

  describe('for "Public" and "Private" privacy', () => {
    it('returns the AZs where there is at least one public subnet AND one private subnet', () => {
      const vpc = {
        aws_subnets: [
          // Region D only has private subnets, Region B only has public subnets, Region C has both
          { subnet_id: '1', availability_zone: 'myRegiond', public: false },
          { subnet_id: '2', availability_zone: 'myRegionb', public: true },
          { subnet_id: '3', availability_zone: 'myRegionb', public: true },
          { subnet_id: '4', availability_zone: 'myRegionc', public: false },
          { subnet_id: '5', availability_zone: 'myRegiond', public: false },
          { subnet_id: '6', availability_zone: 'myRegionb', public: true },
          { subnet_id: '7', availability_zone: 'myRegionc', public: true },
          { subnet_id: '8', availability_zone: 'myRegionc', public: false },
        ],
      } as CloudVPC;
      expect(
        getMatchingAvailabilityZones(testRegion, vpc, [publicPrivacy, privatePrivacy]),
      ).toEqual(['myRegionc']);
    });
  });
});

describe('getSelectedAvailabilityZones', () => {
  it('obtains the availability zones from the VPC details', () => {
    const vpc = vpcList.find((vpc) => vpc.id === 'vpc-0cbe6c1d5f216cdb9') as CloudVPC;
    expect(vpc.name).toEqual('caa-e2e-test-vpc');

    const formSubnets = [
      { privateSubnetId: 'subnet-0fcc28e72f90f0ac4' },
      { privateSubnetId: 'subnet-04f5c843f1753f29d' },
    ];
    expect(getSelectedAvailabilityZones(vpc, formSubnets)).toEqual(['us-east-1d', 'us-east-1a']);
  });

  it('returns empty if the VPC details does not contain the specified subnets', () => {
    const vpc = vpcList.find((vpc) => vpc.id === 'vpc-046c3e3efea64c91e') as CloudVPC;
    expect(vpc.name).toEqual('jaosorior-8vns4-vpc');

    const formSubnets = [
      { privateSubnetId: 'subnet-0fcc28e72f90f0ac4' },
      { privateSubnetId: 'subnet-04f5c843f1753f29d' },
    ];
    expect(getSelectedAvailabilityZones(vpc, formSubnets)).toHaveLength(0);
  });
});
