import React from 'react';

import { waitFor } from '@testing-library/react';

import PodDistruptionBudgetGraceSelect from '~/components/clusters/common/archived_do_not_use/Upgrades/PodDistruptionBudgetGraceSelect';
import { checkAccessibility, render, screen } from '~/testUtils';

describe('<PodDistruptionBudgetGraceSelect />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <PodDistruptionBudgetGraceSelect
        isDisabled={false}
        input={{ value: 60, onChange: jest.fn() }}
      />,
    );

    await checkAccessibility(container);
  });

  it('displays the preselected value', async () => {
    render(
      <PodDistruptionBudgetGraceSelect
        isDisabled={false}
        input={{ value: 60, onChange: jest.fn() }}
      />,
    );

    expect(await screen.findByText('1 hour')).toBeInTheDocument();
  });

  it.each([
    [15, '15 minutes'],
    [30, '30 minutes'],
    [60, '1 hour'],
    [120, '2 hours'],
    [240, '4 hours'],
    [480, '8 hours'],
  ])('properly formats value %s to "%s"', async (value, formattedValue) => {
    render(
      <PodDistruptionBudgetGraceSelect isDisabled={false} input={{ value, onChange: jest.fn() }} />,
    );

    expect(await screen.findByText(formattedValue)).toBeInTheDocument();
  });

  it('handles changing the selected value', async () => {
    const onChange = jest.fn();
    const { user } = render(
      <PodDistruptionBudgetGraceSelect isDisabled={false} input={{ value: 60, onChange }} />,
    );

    await user.click(screen.getByRole('button', { name: '1 hour' }));
    expect(screen.getAllByRole('option')).toHaveLength(6);
    await user.click(screen.getByRole('option', { name: '2 hours' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(120);

    await waitFor(async () => {
      expect(screen.queryByRole('option')).not.toBeInTheDocument();
    });
  });
});
