import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import VersionCard from '../VersionCard';

describe('<VersionCard>', () => {
  const onKeyDown = jest.fn();
  const onClick = jest.fn();
  const getUnMetClusterAcknowledgements = jest.fn().mockReturnValue([]);

  const defaultProps = {
    isRecommended: true,
    version: '4.5.20',
    onKeyDown,
    onClick,
    getUnMetClusterAcknowledgements,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getCard = (container) => container.querySelector('.pf-v6-c-card');

  it('is accessible when recommended', async () => {
    const { container } = render(<VersionCard {...defaultProps} />);

    expect(screen.getByText('Recommended')).toBeInTheDocument();
    const card = getCard(container);

    expect(card).not.toHaveClass('pf-m-selected');

    await checkAccessibility(container);
  });

  it('should render correctly when selected & not recommended', () => {
    const newProps = {
      ...defaultProps,
      isSelected: true,
      version: '4.5.16',
      isRecommended: false,
    };
    render(<VersionCard {...newProps} />);

    expect(screen.queryByText('Recommended')).not.toBeInTheDocument();

    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('should not render a tooltip without any unmet cluster acknowledgements', () => {
    getUnMetClusterAcknowledgements.mockReturnValueOnce([]);

    render(<VersionCard {...defaultProps} />);
    expect(screen.queryByRole('button', { name: 'more information' })).not.toBeInTheDocument();
  });

  it('should render tooltip when has unmet cluster acknowledgements', () => {
    getUnMetClusterAcknowledgements.mockReturnValueOnce([{ id: 'someUpgradeGateId' }]);

    render(<VersionCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'more information' })).toBeInTheDocument();
  });
});
