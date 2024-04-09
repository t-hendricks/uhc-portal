import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import { SubnetSelectField, SubnetSelectFieldProps } from './SubnetSelectField';

const selectedVPC = {
  name: 'ddonati-test403-bsrnf-vpc',
  id: 'vpc-04cbedcecd229b9d7',
  aws_subnets: [
    {
      subnet_id: 'subnet-0d254eb80876999e8',
      name: 'ddonati-test403-bsrnf-make-this-big-private-us-east-1d',
      public: false,
      availability_zone: 'us-east-1d',
    },
    {
      subnet_id: 'subnet-06a6d839ed754a670',
      name: 'ddonati-test403-bsrnf-public-us-east-1c',
      public: true,
      availability_zone: 'us-east-1c',
    },
    {
      subnet_id: 'subnet-011f8e5c954b17ad9',
      name: 'ddonati-test403-bsrnf-private-us-east-1b',
      public: false,
      availability_zone: 'us-east-1b',
    },
    {
      subnet_id: 'subnet-01f23704d96ae03b7',
      name: 'ddonati-test403-bsrnf-public-us-east-1b',
      public: true,
      availability_zone: 'us-east-1b',
    },
    {
      subnet_id: 'subnet-013caf96f643315eb',
      name: 'ddonati-test403-bsrnf-private-us-east-1a',
      public: false,
      availability_zone: 'us-east-1a',
    },
    {
      subnet_id: 'subnet-0e5424551f5f2e9f4',
      name: 'ddonati-test403-bsrnf-private-us-east-1c1',
      public: false,
      availability_zone: 'us-east-1c',
    },
    {
      subnet_id: 'subnet-052a82c226608a8ee',
      name: 'ddonati-test403-bsrnf-private-us-east-1c2',
      public: false,
      availability_zone: 'us-east-1c',
    },
    {
      subnet_id: 'subnet-06452418d71811ef1',
      name: 'ddonati-test403-bsrnf-public-us-east-1a',
      public: true,
      availability_zone: 'us-east-1a',
    },
    {
      subnet_id: 'subnet-07d9cfd4551bfeb48',
      name: 'ddonati-test403-bsrnf-public-us-east-1d',
      public: true,
      availability_zone: 'us-east-1d',
    },
  ],
};

const selectedVPCWithVeryLongName = {
  name: 'ddonati-testing-very-long-name-test403-bsrnf-vpc',
  id: 'vpc-04cbedcecd229b9d7',
  aws_subnets: [
    {
      subnet_id: 'subnet-0d254eb80876999e8',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-make-this-big-private-us-east-1d',
      public: false,
      availability_zone: 'us-east-1d',
    },
    {
      subnet_id: 'subnet-06a6d839ed754a670',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-public-us-east-1c',
      public: true,
      availability_zone: 'us-east-1c',
    },
    {
      subnet_id: 'subnet-011f8e5c954b17ad9',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-private-us-east-1b',
      public: false,
      availability_zone: 'us-east-1b',
    },
    {
      subnet_id: 'subnet-01f23704d96ae03b7',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-public-us-east-1b',
      public: true,
      availability_zone: 'us-east-1b',
    },
    {
      subnet_id: 'subnet-013caf96f643315eb',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-private-us-east-1a',
      public: false,
      availability_zone: 'us-east-1a',
    },
    {
      subnet_id: 'subnet-0e5424551f5f2e9f4',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-private-us-east-1c1',
      public: false,
      availability_zone: 'us-east-1c',
    },
    {
      subnet_id: 'subnet-052a82c226608a8ee',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-private-us-east-1c2',
      public: false,
      availability_zone: 'us-east-1c',
    },
    {
      subnet_id: 'subnet-06452418d71811ef1',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-public-us-east-1a',
      public: true,
      availability_zone: 'us-east-1a',
    },
    {
      subnet_id: 'subnet-07d9cfd4551bfeb48',
      name: 'ddonati-testing-very-long-name-test403-bsrnf-public-us-east-1d',
      public: true,
      availability_zone: 'us-east-1d',
    },
  ],
};

const defaultProps: SubnetSelectFieldProps = {
  name: 'test',
  label: 'test',
  input: {
    name: 'machinePoolsSubnets[0].privateSubnetId',
    value: '',
    onChange: jest.fn(),
  },
  meta: {
    error: 'Subnet is required',
    touched: false,
  },
  isRequired: true,
  privacy: 'private',
  withAutoSelect: false,
  selectedVPC,
};

const defaultPropsWithTruncation: SubnetSelectFieldProps = {
  name: 'test',
  label: 'test',
  input: {
    name: 'machinePoolsSubnets[0].privateSubnetId',
    value: '',
    onChange: jest.fn(),
  },
  meta: {
    error: 'Subnet is required',
    touched: false,
  },
  isRequired: true,
  privacy: 'private',
  withAutoSelect: false,
  selectedVPC: selectedVPCWithVeryLongName,
};

describe('SubnetSelectField', () => {
  it('is accessible', async () => {
    // render dropdown
    const { container } = render(<SubnetSelectField {...defaultProps} />);

    // Assert
    await checkAccessibility(container);
  });

  it('renders the private subnets when privacy=private', async () => {
    // render dropdown
    const { user } = render(<SubnetSelectField {...defaultProps} />);

    // click it open
    const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
    await user.click(selectDropdown);

    // Verify the number of options and that only private subnets are shown
    expect(await screen.findAllByRole('option')).toHaveLength(5);

    expect(
      await screen.findByRole('option', {
        name: /ddonati-test403-bsrnf-private-us-east-1a/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: /ddonati-test403-bsrnf-public-us-east-1a/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders the public subnets when privacy=public', async () => {
    // render dropdown
    const { user } = render(<SubnetSelectField {...defaultProps} privacy="public" />);

    // click it open
    const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
    await user.click(selectDropdown);

    // Verify the number of options and that only public subnets are shown
    expect(await screen.findAllByRole('option')).toHaveLength(4);

    expect(
      await screen.findByRole('option', {
        name: /ddonati-test403-bsrnf-public-us-east-1a/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('option', {
        name: /ddonati-test403-bsrnf-private-us-east-1a/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('filters subnet by text', async () => {
    // render dropdown
    const { user } = render(<SubnetSelectField {...defaultProps} />);

    // click it open
    const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
    await user.click(selectDropdown);

    // type something matching into search
    const searchBox = screen.getByPlaceholderText(/Filter by subnet/i);
    await user.clear(searchBox);
    await user.type(searchBox, '1c');

    // We just assert that there's the expected number of results.
    // Verifying which those are is tested in FuzzySelect
    expect(await screen.findAllByRole('option')).toHaveLength(2);
  });

  it('renders the private subnets when privacy=private and name is truncated', async () => {
    // render dropdown
    const { user } = render(<SubnetSelectField {...defaultPropsWithTruncation} />);

    // click it open
    const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
    await user.click(selectDropdown);

    // Verify the number of options and that only private subnets are shown
    expect(await screen.findAllByRole('option')).toHaveLength(5);

    expect(
      await screen.findByRole('option', {
        name: /ddonati-testi... his-big-private-us-east-1d/i,
      }),
    ).toBeInTheDocument();

    // Get the hoverable label
    const hoverableLabel = await screen.findByText(/ddonati-testi... his-big-private-us-east-1d/i);

    await user.hover(hoverableLabel);

    // Verify that hoverover is displayed
    await screen.findByText(
      /ddonati-testing-very-long-name-test403-bsrnf-make-this-big-private-us-east-1d/i,
    );

    expect(
      screen.queryByRole('option', {
        name: /ddonati-testi... 03-bsrnf-public-us-east-1a/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('renders the public subnets when privacy=public and name is truncated', async () => {
    // render dropdown
    const { user } = render(<SubnetSelectField {...defaultPropsWithTruncation} privacy="public" />);

    // click it open
    const selectDropdown = screen.getByRole('button', { name: 'Options menu' });
    await user.click(selectDropdown);

    // Verify the number of options and that only public subnets are shown
    expect(await screen.findAllByRole('option')).toHaveLength(4);

    expect(
      await screen.findByRole('option', {
        name: /ddonati-testi... 03-bsrnf-public-us-east-1c/i,
      }),
    ).toBeInTheDocument();

    // Get all the hoverable label
    const hoverableLabel = await screen.findByText(/ddonati-testi... 03-bsrnf-public-us-east-1c/i);

    await user.hover(hoverableLabel);

    // Verify that full name hoverover is displayed
    await screen.findByText(/ddonati-testing-very-long-name-test403-bsrnf-public-us-east-1c/i);

    expect(
      screen.queryByRole('option', {
        name: /ddonati-testi... -bsrnf-private-us-east-1a/i,
      }),
    ).not.toBeInTheDocument();
  });
});
