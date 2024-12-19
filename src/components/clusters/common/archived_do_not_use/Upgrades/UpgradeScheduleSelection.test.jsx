import React from 'react';

import UpgradeScheduleSelection from '~/components/clusters/common/archived_do_not_use/Upgrades/UpgradeScheduleSelection';
import { checkAccessibility, render, screen } from '~/testUtils';

const hours = Array.from(Array(24).keys()).map((hour) => [
  hour,
  `${hour.toString().padStart(2, 0)}:00 UTC`,
]);
const days = [
  [0, 'Sunday'],
  [1, 'Monday'],
  [2, 'Tuesday'],
  [3, 'Wednesday'],
  [4, 'Thursday'],
  [5, 'Friday'],
  [6, 'Saturday'],
];
const infoAlert =
  'Recurring updates occur when a new patch (z-stream) update becomes available at least 2 days prior to your selected start time.';
const infoAlertHypershift =
  'For recurring updates, the control plane will be updated when a new version becomes available at least 2 days prior to your selected start time. Worker nodes will need to be manually updated.';
const warningMessage =
  /This cluster has a custom schedule which can not be modified from this page./;
const getHourRegexp = (hour) => new RegExp(String.raw`${hour.toString().padStart(2, 0)}:00 UTC`);

describe('<UpgradeScheduleSelection />', () => {
  it('is accessible', async () => {
    const { container } = render(
      <UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange: jest.fn() }} />,
    );

    await checkAccessibility(container);
  });

  it('set day and hour selects values based on the value provided by props', async () => {
    render(<UpgradeScheduleSelection input={{ value: '0 11 * * 2', onChange: jest.fn() }} />);

    expect(await screen.findByText('Select a day and start time')).toBeInTheDocument();
    expect(screen.getByText(infoAlert)).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText(/11:00 utc/i)).toBeInTheDocument();
  });

  it.each(days)('properly formats day values: %i to "%s"', async (value, formattedValue) => {
    render(<UpgradeScheduleSelection input={{ value: `0 0 * * ${value}`, onChange: jest.fn() }} />);

    expect(await screen.findByText(formattedValue)).toBeInTheDocument();
  });

  it.each(hours)('properly formats hour values: %i to "%s"', async (value) => {
    render(<UpgradeScheduleSelection input={{ value: `0 ${value} * * 0`, onChange: jest.fn() }} />);

    const regexp = getHourRegexp(value);
    expect(await screen.findByText(regexp)).toBeInTheDocument();
  });

  it('allows to change day', async () => {
    const onChange = jest.fn();
    const { user } = render(<UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange }} />);

    expect(onChange).toHaveBeenCalledTimes(0);

    expect(await screen.findByText('Select a day and start time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sunday' })).toBeInTheDocument();

    // Change day
    await user.click(screen.getByRole('button', { name: 'Sunday' }));
    await user.click(screen.getByRole('option', { name: 'Monday' }));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('00 0 * * 1');
  });

  it('allows to change hour', async () => {
    const onChange = jest.fn();
    const { user } = render(<UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange }} />);

    expect(onChange).toHaveBeenCalledTimes(0);

    expect(await screen.findByText('Select a day and start time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /00:00 utc/i })).toBeInTheDocument();

    // Change hour
    await user.click(screen.getByRole('button', { name: /00:00 utc/i }));
    await user.click(screen.getByRole('option', { name: /04:00 utc/i }));

    // Assert
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('00 4 * * 0');
  });

  it('shows proper options for all possible days values', async () => {
    const { user } = render(
      <UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange: jest.fn() }} />,
    );

    expect(await screen.findByText('Sunday')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sunday' }));

    expect(screen.getAllByRole('option')).toHaveLength(days.length);

    days.forEach((day) => {
      expect(screen.getByRole('option', { name: day[1] })).toBeInTheDocument();
    });
  });

  it('shows proper options for all possible hours values', async () => {
    const { user } = render(
      <UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange: jest.fn() }} />,
    );

    expect(await screen.findByRole('button', { name: /00:00 utc/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /00:00 utc/i }));

    expect(screen.getAllByRole('option')).toHaveLength(hours.length);
    hours.forEach((value) => {
      const regexp = getHourRegexp(value[0]);
      expect(screen.getByRole('option', { name: regexp })).toBeInTheDocument();
    });
  });

  it('shows no default selection if no value is passed', () => {
    render(<UpgradeScheduleSelection input={{ value: '', onChange: jest.fn() }} />);

    expect(screen.getByRole('button', { name: 'Select day' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Select hour' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sunday' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /00:00 utc/i })).not.toBeInTheDocument();
  });

  it('shows disabled selects when "isDisabled" is passed', () => {
    render(
      <UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange: jest.fn() }} isDisabled />,
    );

    expect(screen.getByRole('button', { name: 'Sunday' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sunday' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /00:00 utc/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /00:00 utc/i })).toBeDisabled();
  });

  it('shows a warning message if the cron value is not supported', async () => {
    const onChange = jest.fn();
    const { user } = render(<UpgradeScheduleSelection input={{ value: '0 * 14 * *', onChange }} />);

    expect(screen.getByText(infoAlert)).toBeInTheDocument();
    expect(screen.getByText(warningMessage)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'reset the schedule' })).toBeInTheDocument();

    expect(onChange).toBeCalledTimes(0);

    await user.click(screen.getByRole('button', { name: 'reset the schedule' }));

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows a different alert title when "isHypershift" is passed', async () => {
    render(
      <UpgradeScheduleSelection input={{ value: '0 0 * * 0', onChange: jest.fn() }} isHypershift />,
    );

    expect(screen.getByText(infoAlertHypershift)).toBeInTheDocument();
    expect(screen.queryByText(infoAlert)).not.toBeInTheDocument();
  });
});
