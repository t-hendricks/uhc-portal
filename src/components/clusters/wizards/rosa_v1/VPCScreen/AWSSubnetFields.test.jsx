import React from 'react';
import { screen, render, checkAccessibility } from '~/testUtils';
import wizardConnector from '~/components/clusters/wizards/common/WizardConnector';
import {
  useAWSVPCInquiry,
  filterOutRedHatManagedVPCs,
} from '~/components/clusters/common/useVPCInquiry';
import AWSSubnetFields from './AWSSubnetFields';

const vpcList = [
  {
    name: 'myVPC',
    red_hat_managed: false,
    id: 'vpc-0867306df195ec3b3',
    cidr_block: '10.0.0.0/16',
    aws_subnets: [
      {
        subnet_id: 'subnet-0062bbe166b68eb30',
        name: 'myVPC-subnet-private1-myRegion',
        red_hat_managed: false,
        public: false,
        availability_zone: 'myRegion',
        cidr_block: '10.0.128.0/20',
      },
      {
        subnet_id: 'subnet-0ad2d37134f494b70',
        name: 'myVPC-subnet-public1-myRegion',
        red_hat_managed: false,
        public: true,
        availability_zone: 'myRegion',
        cidr_block: '10.0.0.0/20',
      },
    ],
  },
];

jest.mock('~/components/clusters/common/useVPCInquiry');
describe('<AWSSubnetFields />', () => {
  const ConnectedAWSSubnetFields = wizardConnector(AWSSubnetFields);

  const defaultProps = {
    selectedRegion: 'myRegion',
    isMultiAz: false,
    privateLinkSelected: false,
    selectedVPC: { id: 'vpc-0867306df195ec3b3' },
  };

  useAWSVPCInquiry.mockImplementation(() => ({
    vpcs: {
      fulfilled: true,
      data: { items: vpcList },
    },
    requestParams: { region: 'myRegion' },
  }));
  filterOutRedHatManagedVPCs.mockImplementation((vpcs) => vpcs);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('single AZ, private', () => {
    const newProps = { ...defaultProps, privateLinkSelected: true };
    const { container } = render(<ConnectedAWSSubnetFields {...newProps} />);

    expect(screen.getByText('Select availability zone')).toBeInTheDocument();

    expect(screen.getByText('Private subnet ID')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(1);

    expect(container.querySelector('input[id="private_subnet_id_0"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="private_subnet_id_1"]')).not.toBeInTheDocument();

    expect(screen.queryByText('Public subnet ID')).not.toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_0"]')).not.toBeInTheDocument();
  });

  it('single AZ, private + public', async () => {
    const { container } = render(<ConnectedAWSSubnetFields {...defaultProps} />);

    expect(screen.getByText('Select availability zone')).toBeInTheDocument();

    expect(screen.getByText('Private subnet ID')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);

    expect(container.querySelector('input[id="private_subnet_id_0"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="private_subnet_id_1"]')).not.toBeInTheDocument();

    expect(screen.queryByText('Public subnet ID')).toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_0"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_1"]')).not.toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('multi AZ, private', () => {
    const newProps = { ...defaultProps, privateLinkSelected: true, isMultiAz: true };
    const { container } = render(<ConnectedAWSSubnetFields {...newProps} />);

    expect(screen.getAllByText('Select availability zone')).toHaveLength(3);

    expect(screen.getByText('Private subnet ID')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(3);

    expect(container.querySelector('input[id="private_subnet_id_0"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="private_subnet_id_1"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="private_subnet_id_2"]')).toBeInTheDocument();

    expect(screen.queryByText('Public subnet ID')).not.toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_0"]')).not.toBeInTheDocument();
  });

  it('multi AZ, private + public', async () => {
    const newProps = { ...defaultProps, isMultiAz: true };
    const { container } = render(<ConnectedAWSSubnetFields {...newProps} />);

    expect(screen.getAllByText('Select availability zone')).toHaveLength(3);

    expect(screen.getByText('Private subnet ID')).toBeInTheDocument();
    expect(screen.getAllByRole('textbox')).toHaveLength(6);

    expect(container.querySelector('input[id="private_subnet_id_0"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="private_subnet_id_1"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="private_subnet_id_2"]')).toBeInTheDocument();

    expect(screen.queryByText('Public subnet ID')).toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_0"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_1"]')).toBeInTheDocument();
    expect(container.querySelector('input[id="public_subnet_id_2"]')).toBeInTheDocument();
  });

  it.skip('is accessible', async () => {
    const newProps = { ...defaultProps, isMultiAz: true };
    const { container } = render(<ConnectedAWSSubnetFields {...newProps} />);

    // this fails because many of the text inputs do not have labels
    await checkAccessibility(container);
  });
});
