import { processAWSVPCs } from './ccsInquiriesReducer';
import awsVPCs from '../../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';

describe('processAWSVPCs', () => {
  it('works', () => {
    const result = processAWSVPCs(awsVPCs);
    // Contains original response unmodified.
    expect(result.items).toHaveLength(result.size);
    // old API before https://gitlab.cee.redhat.com/service/uhc-clusters-service/-/merge_requests/3852
    expect(result.bySubnetID['subnet-0c17300787ec127bc']).toEqual({
      vpc_id: 'vpc-0c79e0e9acafedaef',
      subnet_id: 'subnet-0c17300787ec127bc',
      public: true,
      availability_zone: 'us-east-1b',
    });
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
