import React from 'react';
import { screen, render } from '~/testUtils';

import { MachinePool } from '~/types/clusters_mgmt.v1';

import MachinePoolExpandedRow from '../components/MachinePoolExpandedRow';

const vpcs = [
  {
    aws_security_groups: [
      {
        name: '',
        id: 'sg-group-without-a-name',
      },
      {
        name: 'abc is my name',
        id: 'sg-abc',
      },
    ],
  },
];

jest.mock(
  '~/components/clusters/ClusterDetails/components/MachinePools/components/AddMachinePoolModal/useAWSVPCsFromCluster',
  () => ({
    useAWSVPCsFromCluster: () => ({ fulfilled: true, data: { items: vpcs } }),
  }),
);

const defaultMachinePool: MachinePool = {
  aws: {
    additional_security_group_ids: ['sg-abc', 'sg-def'],
    spot_market_options: {}, // spot pricing, on-demand
  },
  labels: {
    fooLabel: 'barLabel',
    noValueLabel: '',
  },
  taints: [
    { key: 'fooTaint', value: 'barTaint', effect: 'NoExecute' },
    { key: 'helloTaint', value: 'worldTaint', effect: 'NoSchedule' },
  ],
  subnets: ['subnet-abc', 'subnet-def'],
  autoscaling: { min_replicas: 0, max_replicas: 4 },
};

const getDefaultProps = (machinePoolProps: Partial<MachinePool>) => ({
  isMultiZoneCluster: false,
  machinePool: {
    ...defaultMachinePool,
    ...machinePoolProps,
  },
});

const verifyTextIsPresent = (textItems: string[]) => {
  textItems.forEach((textItem) => {
    expect(screen.queryByText(textItem)).toBeInTheDocument();
  });
};

describe('MachinePoolExpandedRow', () => {
  describe('Labels', () => {
    it('are displayed correctly', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Labels')).toBeInTheDocument();
      verifyTextIsPresent(['fooLabel = barLabel', 'noValueLabel']);
    });

    it('are not displayed if there are none', () => {
      render(
        <MachinePoolExpandedRow
          {...getDefaultProps({
            labels: {},
          })}
        />,
      );
      expect(screen.queryByText('Labels')).not.toBeInTheDocument();
    });
  });

  describe('Taints', () => {
    it('are displayed correctly', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Taints')).toBeInTheDocument();
      verifyTextIsPresent(['fooTaint = barTaint:NoExecute', 'helloTaint = worldTaint:NoSchedule']);
    });

    it('are not displayed if there are none', () => {
      render(
        <MachinePoolExpandedRow
          {...getDefaultProps({
            taints: undefined,
          })}
        />,
      );
      expect(screen.queryByText('Taints')).not.toBeInTheDocument();
    });
  });

  describe('Security groups', () => {
    it('are displayed using their names if available', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Security groups')).toBeInTheDocument();
      verifyTextIsPresent(['abc is my name']);
    });
    it('are displayed using their IDs if names are not available', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Security groups')).toBeInTheDocument();
      verifyTextIsPresent(['sg-def']);
    });

    it('are not displayed if there are none', () => {
      render(
        <MachinePoolExpandedRow
          {...getDefaultProps({
            aws: {
              additional_security_group_ids: [],
            },
          })}
        />,
      );
      expect(screen.queryByText('Security groups')).not.toBeInTheDocument();
    });
  });

  describe('Subnets', () => {
    it('are displayed correctly', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Subnets')).toBeInTheDocument();
      verifyTextIsPresent(['subnet-abc', 'subnet-def']);
    });

    it('are not displayed if there are none', () => {
      render(
        <MachinePoolExpandedRow
          {...getDefaultProps({
            subnets: [],
          })}
        />,
      );
      expect(screen.queryByText('Subnets')).not.toBeInTheDocument();
    });
  });

  describe('Autoscaling settings', () => {
    it('are displayed correctly', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Autoscaling')).toBeInTheDocument();
    });

    it('are not displayed if not enabled', () => {
      render(
        <MachinePoolExpandedRow
          {...getDefaultProps({
            autoscaling: undefined,
          })}
        />,
      );
      expect(screen.queryByText('Autoscaling')).not.toBeInTheDocument();
    });
  });

  describe('Spot price settings', () => {
    it('are displayed correctly', () => {
      render(<MachinePoolExpandedRow {...getDefaultProps({})} />);
      expect(screen.getByText('Spot instance pricing')).toBeInTheDocument();
    });

    it('are not displayed if not set', () => {
      render(
        <MachinePoolExpandedRow
          {...getDefaultProps({
            aws: {
              spot_market_options: undefined,
            },
          })}
        />,
      );
      expect(screen.queryByText('Spot instance pricing')).not.toBeInTheDocument();
    });
  });
});
