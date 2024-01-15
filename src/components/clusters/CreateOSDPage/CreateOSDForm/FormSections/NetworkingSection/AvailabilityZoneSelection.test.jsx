import React from 'react';

import { screen, render, checkAccessibility } from '~/testUtils';
import AvailabilityZoneSelection from './AvailabilityZoneSelection';

describe('<AvailabilityZoneSelection />', () => {
  const onChange = jest.fn();

  const defaultProps = {
    label: 'some label',
    region: 'fake-region',
    input: {
      value: '',
      onChange,
    },
    meta: {},
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<AvailabilityZoneSelection {...defaultProps} />);

    expect(screen.getByText('some label')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Options menu' })).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('is accessible expanded', async () => {
    const { container, user } = render(<AvailabilityZoneSelection {...defaultProps} />);

    expect(screen.getByText('some label')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Options menu' }));

    expect(screen.getAllByRole('option')).toHaveLength(7);
    expect(screen.getByRole('option', { name: 'fake-regionf' })).toBeInTheDocument();

    await checkAccessibility(container);
  });

  it('should show error on error', () => {
    const errorProps = { ...defaultProps, meta: { touched: true, error: 'some error message' } };
    render(<AvailabilityZoneSelection {...errorProps} />);
    expect(screen.getByText('some error message')).toBeInTheDocument();
  });
});
