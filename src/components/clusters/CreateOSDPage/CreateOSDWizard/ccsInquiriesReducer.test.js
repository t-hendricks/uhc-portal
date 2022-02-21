import { processAWSVPCs } from './ccsInquiriesReducer';
import awsVPCs from '../../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';

describe('processAWSVPCs', () => {
  it('works', () => {
    const result = processAWSVPCs(awsVPCs);
    // Contains original response unmodified.
    expect(result.items).toHaveLength(result.size);
    expect(result.bySubnetID['subnet-0c17300787ec127bc']).toEqual({
      vpc_name: 'vpc-0c79e0e9acafedaef',
      subnet_id: 'subnet-0c17300787ec127bc',
      public: true,
      availability_zone: 'us-east-1b',
    });
  });
});
