import React from 'react';
import { screen, render, waitFor, checkAccessibility, fireEvent } from '~/testUtils';
import { SubnetSelectField, SubnetSelectFieldProps } from './SubnetSelectField';

describe('SubnetSelectField tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('select subnet', async () => {
    // render dropdown
    const { container, user } = render(
      <SubnetSelectField {...defaultProps} />, // get defaultProps by putting bp at top of SubnetSelectField in dev mode and capturing the properties
      {},
      {
        ccsInquiries: {
          // get test vpcs data by putting bp at bottom of useAWSVPCInquiry hook in dev mode and and capturing vcps
          vpcs, // we're pretending that dispatch has already used axios to add vcps to state
        },
      },
    );

    // click it open
    const dropdown = screen.getByText(/subnet/i);
    user.click(dropdown);
    await waitFor(() =>
      expect(screen.getByPlaceholderText(/Filter by subnet/i)).toBeInTheDocument(),
    );

    // type something into search
    const searchbox = screen.getByPlaceholderText(/Filter by subnet/i);
    fireEvent.change(searchbox, { target: { value: '1c' } });

    // click option
    await waitFor(() =>
      expect(
        screen.getByRole('option', {
          name: /ddonati-test403-bsrnf-private-us-east- 1c/i,
        }),
      ).toBeInTheDocument(),
    );
    let option = screen.getByRole('option', {
      name: /ddonati-test403-bsrnf-private-us-east- 1c/i,
    });
    user.click(option);
    await waitFor(() =>
      expect(screen.getByText(/ddonati-test403-bsrnf-private-us-east-1c/i)).toBeInTheDocument(),
    );

    // do the same for a truncated one
    user.click(dropdown);
    user.type(searchbox, 'make');
    await waitFor(() =>
      expect(
        screen.getByRole('option', {
          name: /ddonati-test403-bsrnf- make -this-big-private-us-east-1d/i,
        }),
      ).toBeInTheDocument(),
    );
    option = screen.getByRole('option', {
      name: /ddonati-test403-bsrnf- make -this-big-private-us-east-1d/i,
    });
    user.click(option);
    await waitFor(() =>
      expect(
        screen.getByText(/ddonati-test403-... -make-this-big-private-us-east-1d/i),
      ).toBeInTheDocument(),
    );

    // Assert
    await checkAccessibility(container);
  });
});

const defaultProps: SubnetSelectFieldProps = {
  name: 'test',
  label: 'test',
  input: {
    name: 'machine_pools_subnets[0]',
    value: {
      subnet_id: '',
      availability_zone: '',
    },
    onBlur: jest.fn(),
    onChange: jest.fn(),
    onDragStart: jest.fn(),
    onDrop: jest.fn(),
    onFocus: jest.fn(),
  },
  meta: {
    error: 'Subnet is required',
    touched: false,
    autofilled: false,
    asyncValidating: false,
    dirty: false,
    dispatch: jest.fn(),
    form: '',
    initial: undefined,
    invalid: false,
    pristine: false,
    submitting: false,
    submitFailed: false,
    valid: false,
    visited: false,
  },
  isRequired: true,
  privacy: 'private',
  withAutoSelect: false,
  selectedVPC: 'vpc-04cbedcecd229b9d7',
  isNewCluster: true,
};

const vpcs = {
  error: false,
  pending: false,
  fulfilled: true,
  credentials: {
    account_id: '000000000006',
    sts: {
      role_arn: 'arn:aws:iam::000000000006:role/ManagedOpenShift-Installer-Role',
    },
  },
  cloudProvider: 'aws',
  region: 'us-east-1',
  subnet: undefined,
  data: {
    items: [
      {
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
            name: 'ddonati-test403-bsrnf-private-us-east-1c',
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
            subnet_id: 'subnet-052a82c226608a8ee',
            name: 'ddonati-test403-bsrnf-private-us-east-1f',
            public: false,
            availability_zone: 'us-east-1f',
          },
          {
            subnet_id: 'subnet-07d9cfd4551bfeb48',
            name: 'ddonati-test403-bsrnf-public-us-east-1d',
            public: true,
            availability_zone: 'us-east-1d',
          },
          {
            subnet_id: 'subnet-0002e6f75e3317496',
            name: 'ddonati-test403-bsrnf-public-us-east-1f',
            public: true,
            availability_zone: 'us-east-1f',
          },
        ],
      },
    ],
  },
};
