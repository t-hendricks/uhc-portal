import { CloudVPC, Subnetwork } from '~/types/clusters_mgmt.v1';

export type SubnetPrivacy = 'private' | 'public';

const isSubnetMatchingPrivacy = (subnet: Subnetwork, privacy?: SubnetPrivacy) =>
  !privacy || (privacy === 'public' && subnet.public) || (privacy === 'private' && !subnet.public);

/**
 * Finds all the availability zones of this VPC's subnets,
 * that have at least one subnet matching each of the privacy types in "privacyList"
 *
 * e.g. us-west-2a: prv1, pub1, us-west-2c:prv2, us-west-2f:pub3
 * and privacyList=["public,private"] --> us-west-2a
 * and privacyList=["public"] --> us-west-2a, us-west-2f
 * and privacyList=["private"] --> us-west-2a, us-west-2c
 *
 * @param region region
 * @param vpc Cloud VPC
 * @param privacyList required privacy types ("public", "private")
 *
 * @returns SubnetPrivacy[] List of availability zones which have the required subnets
 */
const getMatchingAvailabilityZones = (
  region: string,
  vpc: CloudVPC,
  privacyList: SubnetPrivacy[],
) =>
  ['a', 'b', 'c', 'd', 'e', 'f']
    .map((letter) => `${region}${letter}`)
    .filter((zoneId) =>
      // For every zone and privacy type, there must be at least one subnet that matches both criteria
      privacyList.every((privacy) =>
        vpc.aws_subnets?.some(
          (subnet) =>
            subnet.availability_zone === zoneId && isSubnetMatchingPrivacy(subnet, privacy),
        ),
      ),
    );

/**
 * Obtains the information of the availability zone of a subnet from the VPC details
 *
 * @param vpc Cloud VPC
 * @param formSubnets subnet details taken from the form
 * @returns array of unique availability zones belonging to the specified private subnets
 */
const getSelectedAvailabilityZones = (
  vpc: CloudVPC,
  formSubnets: { privateSubnetId: string }[],
) => {
  const azs: string[] = [];
  formSubnets.forEach((formSubnet) => {
    const az = (vpc.aws_subnets || []).find(
      (vpcSubnet) => formSubnet.privateSubnetId === vpcSubnet.subnet_id,
    )?.availability_zone;
    if (az && !azs.includes(az)) {
      azs.push(az);
    }
  });
  return azs;
};

const vpcHasPrivateSubnets = (vpc: CloudVPC) =>
  (vpc.aws_subnets || []).some((subnet) => isSubnetMatchingPrivacy(subnet, 'private'));

/**
 * Returns only the VPCs that are not managed by Red Hat

 * @param vpcs list of VPC items
 * @returns CloudVPC[] copy of the VPC list
 */
const filterOutRedHatManagedVPCs = (vpcs: CloudVPC[]) =>
  vpcs.filter((vpcItem) => !vpcItem.red_hat_managed);

export {
  vpcHasPrivateSubnets,
  filterOutRedHatManagedVPCs,
  getMatchingAvailabilityZones,
  getSelectedAvailabilityZones,
  isSubnetMatchingPrivacy,
};
