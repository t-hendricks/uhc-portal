import * as React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { render, screen, TestRouter } from '~/testUtils';

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
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode securityGroups={securityGroups} />
          </CompatRouter>
        </TestRouter>,
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('With all needed data provided', () => {
    it('renders each control and infra nodes', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode
              securityGroups={securityGroups}
              securityGroupIdsForControl={securityGroupIdsForControl}
              securityGroupIdsForInfra={securityGroupIdsForInfra}
            />
          </CompatRouter>
        </TestRouter>,
      );

      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();
      expect(screen.getByText('Infrastructure nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-a-name')).toBeInTheDocument();
      expect(screen.getByText('sg-b-name')).toBeInTheDocument();
      expect(screen.getByText('sg-without-name')).toBeInTheDocument();
    });

    it('renders each machine pool node', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode
              securityGroups={securityGroups}
              machinePoolData={machinePoolData}
            />
          </CompatRouter>
        </TestRouter>,
      );

      expect(screen.getByText('Compute (worker) nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-mp1-name')).toBeInTheDocument();
      expect(screen.getByText('Compute (test-worker) nodes')).toBeInTheDocument();
      expect(screen.getByText('sg-mp2-name')).toBeInTheDocument();
    });
    it('renders link to machine pool tab', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode
              securityGroups={securityGroups}
              machinePoolData={machinePoolData}
              showLinkToMachinePools
            />
          </CompatRouter>
        </TestRouter>,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.getByText(moreInfoMessage)).toBeInTheDocument();
    });
    it('renders no link to machine pool tab if machine pools have no security group ids, even if the showLink flag is set', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode
              securityGroups={securityGroups}
              securityGroupIdsForControl={securityGroupIdsForControl}
              securityGroupIdsForInfra={securityGroupIdsForInfra}
              machinePoolData={[]}
              showLinkToMachinePools
            />
          </CompatRouter>
        </TestRouter>,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.queryByText(moreInfoMessage)).not.toBeInTheDocument();
    });
    it('renders no link to machine pool tab because the showLink flag is set to false', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode
              securityGroups={securityGroups}
              securityGroupIdsForControl={securityGroupIdsForControl}
              securityGroupIdsForInfra={securityGroupIdsForInfra}
              machinePoolData={machinePoolData}
              showLinkToMachinePools={false}
            />
          </CompatRouter>
        </TestRouter>,
      );
      const moreInfoMessage = 'See more information in the';
      expect(screen.queryByText(moreInfoMessage)).not.toBeInTheDocument();
    });
  });
  describe('With partial data provided', () => {
    it('renders with all data, but hides infrastructure node in case security groups are missing', () => {
      render(
        <TestRouter>
          <CompatRouter>
            <SecurityGroupsDisplayByNode
              securityGroups={securityGroups}
              securityGroupIdsForControl={securityGroupIdsForControl}
              securityGroupIdsForInfra={emptySecurityGroups}
            />
          </CompatRouter>
        </TestRouter>,
      );

      expect(screen.getByText('Control plane nodes')).toBeInTheDocument();
      expect(screen.queryByText('Infrastructure nodes')).not.toBeInTheDocument();
      expect(screen.getByText('sg-a-name')).toBeInTheDocument();
    });
  });
});
