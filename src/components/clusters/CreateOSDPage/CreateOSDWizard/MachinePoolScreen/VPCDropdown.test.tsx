import React from 'react';

import { render, screen, fireEvent } from '~/testUtils';
import VPCDropdown from './VPCDropdown';
import { useAWSVPCInquiry } from '../VPCScreen/useVPCInquiry';

const defaultProps = {
  selectedVPC: { id: '', name: '' },
  input: { value: '', onBlur: () => {}, onChange: () => {} },
  showRefresh: true,
  meta: { error: '', touched: false },
};

const vpcList = [
  {
    name: 'jaosorior-8vns4-vpc',
    red_hat_managed: false,
    id: 'vpc-046c3e3efea64c91e',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0ef3450e32176b7a9',
        name: 'jaosorior-8vns4-public-us-east-1f',
        red_hat_managed: false,
        public: true,
        availability_zone: 'us-east-1f',
        cidr_block: '10.0.64.0/20',
      },
    ],
  },
  {
    name: 'caa-e2e-test-vpc',
    red_hat_managed: false,
    id: 'vpc-0cbe6c1d5f216cdb9',
    cidr_block: '10.0.0.0/24',
    aws_subnets: [
      {
        subnet_id: 'subnet-0fcc28e72f90f0ac4',
        name: 'caa-e2e-test-subnet',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1d',
        cidr_block: '10.0.0.0/25',
      },
      {
        subnet_id: 'subnet-04f5c843f1753f29d',
        name: 'caa-e2e-test-subnet-2',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.128/25',
      },
    ],
  },
  {
    name: 'zac-east-vpc',
    red_hat_managed: false,
    id: 'vpc-0867306df195ec3b3',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0062bbe166b68eb30',
        name: 'zac-east-subnet-private1-us-east-1a',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.128.0/20',
      },
      {
        subnet_id: 'subnet-0ad2d37134f494b70',
        name: 'zac-east-subnet-public1-us-east-1a',
        red_hat_managed: false,
        public: true,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.0/20',
      },
    ],
  },
  {
    name: 'example-5kqtl-vpc',
    red_hat_managed: false,
    id: 'vpc-02719dc0176c44199',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0a883dabe62e19193',
        name: 'example-5kqtl-private-us-east-1a',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.128.0/20',
      },
      {
        subnet_id: 'subnet-051a46a9f4f78faae',
        name: 'example-5kqtl-public-us-east-1a',
        red_hat_managed: false,
        public: false,
        availability_zone: 'us-east-1a',
        cidr_block: '10.0.0.0/20',
      },
    ],
  },
  {
    name: 'lz-p2-318-z6fst-vpc',
    red_hat_managed: false,
    id: 'vpc-099304b69dd838794',
    cidr_block: '10.0.0.0/19',
  },
];
const testRegion = 'us-west-2';

jest.mock('./../VPCScreen/useVPCInquiry');

describe('<VPCDropdown />', () => {
  describe('When some VPCs exist', () => {
    beforeEach(() => {
      (useAWSVPCInquiry as jest.Mock).mockImplementation(() => ({
        fulfilled: true,
        data: { items: vpcList },
        region: testRegion,
      }));
    });

    it('shows refresh available', () => {
      render(<VPCDropdown {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Refresh' })).toBeEnabled();
    });

    it('shows search in select vpc dropdown', async () => {
      render(<VPCDropdown {...defaultProps} />);
      expect(await screen.findByText(/select a vpc/i)).toBeInTheDocument();
      const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
      fireEvent.keyDown(selectDropdown, { key: 'Enter' }); // this is the only way to open select! using click doesn't work
      expect(screen.getByPlaceholderText('Filter by VPC')).toBeInTheDocument();
    });

    it('shows the selected cloud provider region information', () => {
      render(<VPCDropdown {...defaultProps} />);

      expect(
        screen.getByText(
          `Specify a VPC to install your machine pools into in your selected region: ${testRegion}`,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('When no VPCs exist', () => {
    beforeEach(() => {
      (useAWSVPCInquiry as jest.Mock).mockImplementation(() => ({
        fulfilled: true,
        data: { items: [] },
        region: testRegion,
      }));
    });
    it('shows a useAWSVPCInquiry if no VPCs were found', async () => {
      render(<VPCDropdown {...defaultProps} />);
      expect(await screen.findByText(/No VPCs found/i)).toBeInTheDocument();
    });
  });
});
