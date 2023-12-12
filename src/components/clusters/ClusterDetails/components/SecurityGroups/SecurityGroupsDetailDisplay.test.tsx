import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
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
      const { container } = render(
        <BrowserRouter>
          <SecurityGroupsDisplayByNode securityGroups={securityGroups} />
        </BrowserRouter>,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('With all needed data provided', () => {
    it('renders each control and infra nodes', () => {
      render(
        <BrowserRouter>
          <SecurityGroupsDisplayByNode
            securityGroups={securityGroups}
            securityGroupIdsForControl={securityGroupIdsForControl}
            securityGroupIdsForInfra={securityGroupIdsForInfra}
          />
        </BrowserRouter>,
      );

      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-a-name')).toBeInTheDocument();
      expect(screen.getByText('sg-b-name')).toBeInTheDocument();
      expect(screen.getByText('sg-without-name')).toBeInTheDocument();
    });

    it('renders each machine pool node', () => {
      render(
        <BrowserRouter>
          <SecurityGroupsDisplayByNode
            securityGroups={securityGroups}
            machinePoolData={machinePoolData}
          />
        </BrowserRouter>,
      );

      expect(screen.getByText('Compute (worker) nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-mp1-name')).toBeInTheDocument();
      expect(screen.getByText('Compute (test-worker) nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-mp2-name')).toBeInTheDocument();
    });
    it('renders link to machine pool tab', () => {
      render(
        <BrowserRouter>
          <SecurityGroupsDisplayByNode
            securityGroups={securityGroups}
            machinePoolData={machinePoolData}
            showLinkToMachinePools
          />
        </BrowserRouter>,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.getByText(moreInfoMessage)).toBeInTheDocument();
    });
    it('renders no link to machine pool tab if machine pools have no security group ids, even if the showLink flag is set', () => {
      render(
        <BrowserRouter>
          <SecurityGroupsDisplayByNode
            securityGroups={securityGroups}
            securityGroupIdsForControl={securityGroupIdsForControl}
            securityGroupIdsForInfra={securityGroupIdsForInfra}
            machinePoolData={[]}
            showLinkToMachinePools
          />
        </BrowserRouter>,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.queryByText(moreInfoMessage)).not.toBeInTheDocument();
    });
    it('renders no link to machine pool tab because the showLink flag is set to false', () => {
      render(
        <BrowserRouter>
          <SecurityGroupsDisplayByNode
            securityGroups={securityGroups}
            securityGroupIdsForControl={securityGroupIdsForControl}
            securityGroupIdsForInfra={securityGroupIdsForInfra}
            machinePoolData={machinePoolData}
            showLinkToMachinePools={false}
          />
        </BrowserRouter>,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.queryByText(moreInfoMessage)).not.toBeInTheDocument();
    });
  });
});
