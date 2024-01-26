import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';
import { parseValueWithUnit } from '../../../../common/units';
import SmallClusterChart from './SmallClusterChart';

const getValue = ({ value, unit }) => parseValueWithUnit(value, unit);
const memory = {
  used: {
    value: 16546058240,
    unit: 'B',
  },
  total: {
    value: 82293346304,
    unit: 'B',
  },
};
// TODO: This component is not fully testable because a large portion of the data is only displayed in SVGs
// and is not accessible.  Besides not easily testable this is a large accessibility concern.

describe('<SmallClusterChart />', () => {
  const defaultProps = {
    title: 'Memory',
    total: getValue(memory.total),
    used: getValue(memory.used),
    unit: 'B',
    humanize: true,
    donutId: 'memory_donut',
    availableTitle: 'Available',
    usedTitle: 'Used',
  };

  it.skip('is accessible', async () => {
    const { container } = render(<SmallClusterChart {...defaultProps} />);

    // This fails due to numerous accessibility issues
    await checkAccessibility(container);
  });

  it('should render', () => {
    render(<SmallClusterChart {...defaultProps} />);

    expect(screen.getByText('Used: 15.41 GiB')).toBeInTheDocument();
    expect(screen.getByText('Available: 61.23 GiB')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
});
