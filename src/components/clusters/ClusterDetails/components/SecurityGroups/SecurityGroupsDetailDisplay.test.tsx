import * as React from 'react';

import { render, screen } from '~/testUtils';

import SecurityGroupsDisplayByNode from './SecurityGroupsDetailDisplay';

const securityGroups = [
  { id: 'sg-a', name: 'sg-a-name' },
  { id: 'sg-b', name: 'sg-b-name' },
  { id: 'sg-mp-1', name: 'sg-mp1-name' },
  { id: 'sg-mp-2', name: 'sg-mp2-name' },
];
const securityGroupIdsForControl = ['sg-a'];
const securityGroupIdsForInfra = ['sg-b', 'sg-without-name'];
const machinePoolData = [
  { id: 'worker', aws: { additional_security_group_ids: ['sg-mp-1'] } },
  { id: 'test-worker', aws: { additional_security_group_ids: ['sg-mp-2'] } },
];

describe('<SecurityGroupsDetailDisplayByNode />', () => {
  describe('with empty security group ids per node', () => {
    it('returns no content', () => {
      const { container } = render(<SecurityGroupsDisplayByNode securityGroups={securityGroups} />);

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('With all needed data provided', () => {
    it('renders each control and infra nodes', () => {
      render(
        <SecurityGroupsDisplayByNode
          securityGroups={securityGroups}
          securityGroupIdsForControl={securityGroupIdsForControl}
          securityGroupIdsForInfra={securityGroupIdsForInfra}
        />,
      );

      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-a-name')).toBeInTheDocument();
      expect(screen.getByText('sg-b-name')).toBeInTheDocument();
      expect(screen.getByText('sg-without-name')).toBeInTheDocument();
    });

    it('renders each machine pool node', () => {
      render(
        <SecurityGroupsDisplayByNode
          securityGroups={securityGroups}
          machinePoolData={machinePoolData}
        />,
      );

      expect(screen.getByText('Compute (worker) nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-mp1-name')).toBeInTheDocument();
      expect(screen.getByText('Compute (test-worker) nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-mp2-name')).toBeInTheDocument();
    });
    it('renders link to machine pool tab', () => {
      render(
        <SecurityGroupsDisplayByNode
          securityGroups={securityGroups}
          machinePoolData={machinePoolData}
          showLinkToMachinePools
        />,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.getByText(moreInfoMessage)).toBeInTheDocument();
    });
    it('renders no link to machine pool tab if machine pools have no security group ids, even if the showLink flag is set', () => {
      render(
        <SecurityGroupsDisplayByNode
          securityGroups={securityGroups}
          securityGroupIdsForControl={securityGroupIdsForControl}
          securityGroupIdsForInfra={securityGroupIdsForInfra}
          machinePoolData={[]}
          showLinkToMachinePools
        />,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.queryByText(moreInfoMessage)).not.toBeInTheDocument();
    });
    it('renders no link to machine pool tab because the showLink flag is set to false', () => {
      render(
        <SecurityGroupsDisplayByNode
          securityGroups={securityGroups}
          securityGroupIdsForControl={securityGroupIdsForControl}
          securityGroupIdsForInfra={securityGroupIdsForInfra}
          machinePoolData={machinePoolData}
          showLinkToMachinePools={false}
        />,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.queryByText(moreInfoMessage)).not.toBeInTheDocument();
    });
  });
  describe('With partial data provided', () => {
    it('renders with all data, but hides infrastructure node in case security groups are missing', () => {
      render(
        <SecurityGroupsDisplayByNode
          securityGroups={securityGroups}
          securityGroupIdsForControl={securityGroupIdsForControl}
          securityGroupIdsForInfra={[]}
        />,
      );

      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();
      expect(screen.queryByText('Infrastructure nodes')).not.toBeInTheDocument();
      expect(screen.getByText('sg-a-name')).toBeInTheDocument();
    });
  });
});
