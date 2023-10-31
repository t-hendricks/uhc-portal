import {
  processAWSVPCs,
  indexRegions,
} from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';
import { CloudRegion, CloudVPC } from '~/types/clusters_mgmt.v1';
import vpcResponse from '../../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';
import awsRegions from '../../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/regions.json';

const vpcItems = vpcResponse.items as CloudVPC[];

describe('processAWSVPCs', () => {
  it('adds bySubnetId with correct data', () => {
    // Backend has technical difficulties with optional arrays in JSON.
    // This mockData contains `aws_subnets: null` which is totally a real thing backend
    // may return even when `aws_subnets: []` would be appropriate.
    //
    // Our openapi-derived `CloudVPC` type only describes array | undefined.
    // TODO: Ideally TS should be aware of `null` possibility!
    //   For now making a *false promise* to TS that it's `CloudVPC` i.e. without `null`,
    //   so it will let us test actual run-time handling of actual real data...
    const result = processAWSVPCs(vpcItems);

    // new API
    expect(result.bySubnetID['subnet-0d3a4a32658ee415a']).toEqual({
      vpc_id: 'vpc-0d5c8e4d499be6630',
      vpc_name: 'SDA-5333-test-new-API-returning-both-name-and-id',
      subnet_id: 'subnet-0d3a4a32658ee415a',
      name: 'sda-ocp-410-n7d9b-private-us-east-1a',
      public: false,
      availability_zone: 'us-east-1a',
    });
    // new API when for vpc and subnet lacking a Name tag
    expect(result.bySubnetID['subnet-id-without-Name']).toEqual({
      vpc_id: 'SDA-5333-test-new-API-returning-only-id-for-VPC-without-Name-tag',
      subnet_id: 'subnet-id-without-Name',
      public: false,
      availability_zone: 'us-west-1a',
    });
  });

  it('returns the VPC items in the same order', () => {
    const result = processAWSVPCs(vpcItems);

    expect(result.items).toHaveLength(vpcItems.length);
    vpcItems.forEach((vpc, index) => {
      expect(vpc.name).toEqual(result.items[index].name);
    });
  });

  it('removes the Red Hat managed security groups', () => {
    const vpcId = 'vpc-with-security-groups';
    const result = processAWSVPCs(vpcItems);

    const processedVpcWithSGs = result.items.find((vpc) => vpc.id === vpcId) as CloudVPC;

    const resultSgs = processedVpcWithSGs.aws_security_groups || [];
    expect(resultSgs.length).toEqual(5);
    resultSgs.forEach((sg) => {
      expect(sg.red_hat_managed).toBeFalsy();
    });
  });

  it('sorts the VPC security groups by their display order', () => {
    const result = processAWSVPCs(vpcItems);
    const vpcId = 'vpc-with-security-groups';

    const processedVpcWithSGs = result.items.find((vpc) => vpc.id === vpcId) as CloudVPC;
    const resultSgs = processedVpcWithSGs.aws_security_groups || [];

    const expectSortOrder = [
      {
        id: 'sg-xyz',
        name: 'sg-a-name-that-should-go-first',
      },
      {
        id: 'sg-def',
        name: 'sg-def',
      },
      {
        id: 'sg-abc',
        name: 'sg-pqr',
      },
      {
        id: 'sg-123-no-name',
        name: '',
      },
      {
        id: 'sg-no-name',
        name: '',
      },
    ];
    expect(resultSgs.map((sg) => sg.id)).toEqual(expectSortOrder.map((sg) => sg.id));
  });
});

describe('indexRegions', () => {
  it('handles null items', () => {
    // Don't remember if this API may serializes empty `items` as `null` but let's be defensive.
    // See above about `as` cast.
    const data = { items: null } as unknown as { items: CloudRegion[] };
    expect(indexRegions(data)).toEqual({});
  });

  it('indexes regions correctly', () => {
    const byID = indexRegions(awsRegions);
    expect(byID[awsRegions.items[0].id]).toEqual(awsRegions.items[0]);
    expect(byID['ap-east-1']).toMatchObject({
      id: 'ap-east-1',
      ccs_only: true,
    });
  });
});
