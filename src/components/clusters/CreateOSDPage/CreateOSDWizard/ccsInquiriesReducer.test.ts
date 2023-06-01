import { processAWSVPCs } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import awsVPCs from '../../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';

describe('processAWSVPCs', () => {
  it('works', () => {
    // Backend has technical difficulties with optional arrays in JSON.
    // This mockdata contains `aws_subnets: null` which is totally a real thing backend
    // may return even when `aws_subnets: []` would be appropriate.
    //
    // Our openapi-derived `CloudVPC` type only describes array | undefined.
    // TODO: Ideally TS should be aware of `null` possiblity!
    //   For now making a *false promise* to TS that it's `CloudVPC` i.e. without `null`,
    //   so it will let us test actual run-time handling of actual real data...
    const result = processAWSVPCs(awsVPCs as { items: CloudVPC[] });

    // Contains original items unmodified.
    expect(result.items).toHaveLength(awsVPCs.size);
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
});
