import React from 'react';
import { render, screen, checkAccessibility } from '~/testUtils';

import CancelUpgradeModal from './CancelUpgradeModal';

describe('<CancelUpgradeModal />', () => {
  const closeModal = jest.fn();
  const deleteSchedule = jest.fn();
  const clearDeleteScheduleResponse = jest.fn();

  const defaultProps = {
    isOpen: true,
    closeModal,
    deleteSchedule,
    deleteScheduleRequest: {},
    schedule: {
      id: 'myScheduleId',
      cluster_id: 'myClusterId',
      version: 'v1.2.3',
      next_run: new Date('2020-11-02').toISOString(),
    },
    clearDeleteScheduleResponse,
    isHypershift: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<CancelUpgradeModal {...defaultProps} />);
    await checkAccessibility(container);
  });

  it('calls deleteSchedule when button is clicked', async () => {
    const { user } = render(<CancelUpgradeModal {...defaultProps} />);
    expect(deleteSchedule).not.toBeCalled();

    await user.click(screen.getByRole('button', { name: 'Cancel this update' }));
    expect(deleteSchedule).toBeCalledWith('myClusterId', 'myScheduleId', false);
  });

  it('clears request state when fulfilled and closes modal', () => {
    const { rerender } = render(<CancelUpgradeModal {...defaultProps} />);
    expect(clearDeleteScheduleResponse).not.toBeCalled();
    expect(closeModal).not.toBeCalled();

    const fulfilledProps = {
      ...defaultProps,
      deleteScheduleRequest: { fulfilled: true },
    };
    rerender(<CancelUpgradeModal {...fulfilledProps} />);
    expect(clearDeleteScheduleResponse).toBeCalled();
    expect(closeModal).toBeCalled();
  });
});
