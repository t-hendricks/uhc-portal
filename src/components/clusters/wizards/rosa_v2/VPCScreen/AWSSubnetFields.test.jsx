import React from 'react';
import { Formik } from 'formik';

import { useAWSVPCInquiry } from '~/components/clusters/common/useVPCInquiry';
import { checkAccessibility, render, screen, waitFor } from '~/testUtils';

import { initialValues } from '../constants';

import AWSSubnetFields from './AWSSubnetFields';

const subnets = [
  {
    public: false,
    az: 'a',
  },
  {
    public: true,
    az: 'a',
  },
  {
    public: false,
    az: 'd',
  },
  {
    public: true,
    az: 'd',
  },
  {
    public: false,
    az: 'e',
  },
  {
    public: true,
    az: 'e',
  },
  {
    public: true,
    az: 'c',
  },
].map((subnetInfo, index) => ({
  subnet_id: `subnet-${index}`,
  name: `myVPC-subnet-${subnetInfo.public ? 'public' : 'private'}-myRegion${subnetInfo.az}`,
  public: subnetInfo.public,
  availability_zone: `myRegion${subnetInfo.az}`,
  cidr_block: '10.0.128.0/20',
  red_hat_managed: false,
}));

const selectedVPC = {
  name: 'myVPC',
  red_hat_managed: false,
  id: 'vpc-0867306df195ec3b3',
  cidr_block: '10.0.0.0/16',
  aws_subnets: subnets,
};

jest.mock('~/components/clusters/common/useVPCInquiry');

const buildTestComponent = (children, formValues = {}) => (
  <Formik
    initialValues={{
      ...initialValues,
      ...formValues,
    }}
    onSubmit={() => {}}
  >
    {children}
  </Formik>
);

describe('<AWSSubnetFields />', () => {
  const defaultProps = {
    selectedRegion: 'myRegion',
    isMultiAz: false,
    privateLinkSelected: false,
    selectedAZs: [],
    selectedVPC,
  };
  const initialValues = {
    machinePoolsSubnets: [{ privateSubnetId: '', availabilityZone: '' }],
  };

  useAWSVPCInquiry.mockImplementation(() => ({
    vpcs: {
      fulfilled: true,
      data: { items: [selectedVPC] },
    },
    requestParams: { region: 'myRegion' },
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('single AZ, private', async () => {
    const newProps = { ...defaultProps, privateLinkSelected: true };
    render(buildTestComponent(<AWSSubnetFields {...newProps} />, initialValues));

    // Assert - the correct fields titles are shown
    expect(await screen.findByText('Select availability zone')).toBeInTheDocument();
    expect(screen.getByText('Private subnet')).toBeInTheDocument();
    expect(screen.queryByText('Public subnet')).not.toBeInTheDocument();

    // Assert - only 1 subnet dropdown is shown (private subnet)
    expect(screen.getAllByText('Select private subnet')).toHaveLength(1);
    expect(screen.queryByText('Select public subnet')).not.toBeInTheDocument();
  });

  it('single AZ, private + public', async () => {
    const { container } = render(
      buildTestComponent(<AWSSubnetFields {...defaultProps} />, initialValues),
    );

    // Assert - the correct fields titles are shown
    await waitFor(() => {
      expect(screen.getByText('Select availability zone')).toBeInTheDocument();
    });
    expect(await screen.findByText('Private subnet')).toBeInTheDocument();
    expect(await screen.findByText('Public subnet')).toBeInTheDocument();

    // Assert - 2 subnet dropdowns are shown (private and public subnet)
    expect(await screen.findAllByText('Select private subnet')).toHaveLength(1);
    expect(await screen.findAllByText('Select public subnet')).toHaveLength(1);

    await checkAccessibility(container);
  });

  it('multi AZ, private', async () => {
    const newProps = { ...defaultProps, privateLinkSelected: true, isMultiAz: true };
    render(buildTestComponent(<AWSSubnetFields {...newProps} />, initialValues));

    // Assert - the correct fields titles are shown
    expect(await screen.findAllByText('Select availability zone')).toHaveLength(3);
    expect(screen.getByText('Private subnet')).toBeInTheDocument();
    expect(screen.queryByText('Public subnet')).not.toBeInTheDocument();

    // Assert - 3 subnet dropdowns are shown (for 3 private subnets)
    expect(screen.getAllByText('Select private subnet')).toHaveLength(3);
    expect(screen.queryByText('Select public subnet')).not.toBeInTheDocument();
  });

  it('multi AZ, private + public', async () => {
    const newProps = {
      ...defaultProps,
      isMultiAz: true,
    };
    const { container } = render(
      buildTestComponent(<AWSSubnetFields {...newProps} />, initialValues),
    );

    // Assert - the correct fields titles are shown
    expect(await screen.findAllByText('Select availability zone')).toHaveLength(3);

    expect(await screen.findByText('Private subnet')).toBeInTheDocument();
    expect(await screen.findByText('Public subnet')).toBeInTheDocument();

    // Assert - 6 subnet dropdowns are shown (3 private subnets and 3 for public subnets)
    expect(screen.getAllByText('Select private subnet')).toHaveLength(3);
    expect(screen.getAllByText('Select public subnet')).toHaveLength(3);

    await checkAccessibility(container);
  });

  describe('subnetDropdown options', () => {
    it('only a placeholder text is shown when its AZ is not selected yet', async () => {
      const newProps = {
        ...defaultProps,
        isMultiAz: true,
        selectedAZs: [],
      };
      render(buildTestComponent(<AWSSubnetFields {...newProps} />, initialValues));

      expect(await screen.findAllByText('Select availability zone')).toHaveLength(3);
      expect(screen.queryByText(/myVPC-subnet-private-myRegion/)).not.toBeInTheDocument();
    });

    it('the correct subnets are shown for the selected AZs', async () => {
      const newProps = {
        ...defaultProps,
        isMultiAz: true,
        // Regions "a" and "e" have private and public subnets, Region "c" has only public subnets
        selectedAZs: ['myRegione', 'myRegionc', 'myRegiona'],
      };
      const newValues = {
        machinePoolsSubnets: [
          { availabilityZone: 'myRegione', privateSubnetId: '' },
          { availabilityZone: 'myRegionc', privateSubnetId: '' },
          { availabilityZone: 'myRegiona', privateSubnetId: '' },
        ],
      };
      const { user } = render(buildTestComponent(<AWSSubnetFields {...newProps} />, newValues));

      // Dropdown order is:
      // 0: VPCDropdown
      // 1-3: mp[0] (az, privateSubnet, publicSubnet)
      // 4-6: mp[1] (az, privateSubnet, publicSubnet)
      // 7-9: mp[2] (az, privateSubnet, publicSubnet)
      const dropdownButtons = await screen.findAllByRole('button', { name: 'Options menu' });
      expect(dropdownButtons).toHaveLength(10);

      // Assert - mp[0]
      // Private subnets should exist
      await user.click(dropdownButtons[2]);
      expect(screen.getByText('myVPC-subnet-private-myRegione')).toBeInTheDocument();

      // Public subnets should exist
      await user.click(dropdownButtons[3]);
      expect(screen.getByText('myVPC-subnet-public-myRegione')).toBeInTheDocument();

      // Assert - mp[1]
      // Private subnets should not exist
      await user.click(dropdownButtons[5]);
      expect(screen.queryByText('myVPC-subnet-private-myRegionc')).not.toBeInTheDocument();

      // Public subnets should exist
      await user.click(dropdownButtons[6]);
      expect(screen.getByText('myVPC-subnet-public-myRegionc')).toBeInTheDocument();

      // Assert - mp[2]
      // Private subnets should exist
      await user.click(dropdownButtons[8]);
      expect(screen.getByText('myVPC-subnet-private-myRegiona')).toBeInTheDocument();

      // Public subnets should exist
      await user.click(dropdownButtons[9]);
      expect(screen.getByText('myVPC-subnet-public-myRegiona')).toBeInTheDocument();
    });
  });
});
