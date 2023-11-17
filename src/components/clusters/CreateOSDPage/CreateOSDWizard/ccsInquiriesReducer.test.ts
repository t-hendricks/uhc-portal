import { processAWSVPCs } from '~/components/clusters/CreateOSDPage/CreateOSDWizard/ccsInquiriesReducer';
import { CloudVPC } from '~/types/clusters_mgmt.v1';
import vpcResponse from '../../../../../mockdata/api/clusters_mgmt/v1/aws_inquiries/vpcs.json';

const vpcItems = vpcResponse.items as CloudVPC[];

describe('processAWSVPCs', () => {
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
