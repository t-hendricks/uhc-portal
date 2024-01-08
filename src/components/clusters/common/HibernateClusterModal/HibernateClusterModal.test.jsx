import React from 'react';

import { render, screen, checkAccessibility, within } from '~/testUtils';

import HibernateClusterModal from './HibernateClusterModal';

describe('<HibernateClusterModal />', () => {
  const closeModal = jest.fn();
  const onClose = jest.fn();
  const submit = jest.fn();
  const resetResponses = jest.fn();
  const upgradeScheduleRequest = jest.fn();
  const getSchedules = jest.fn();
  const history = { push: jest.fn() };

  const defaultProps = {
    isOpen: true,
    getSchedules,
    clusterUpgrades: { errorMessage: '', error: false, items: [] },
    history,
    hibernateClusterResponse: { errorMessage: '', error: false },
    upgradeScheduleRequest,
    closeModal,
    onClose,
    submit,
    resetResponses,
    clusterName: 'some-name',
    clusterID: 'some-id',
    subscriptionID: 'some-other-id',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible with modal open', async () => {
    const { container } = render(<HibernateClusterModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('displays an error when hibernate cluster response is an error', () => {
    const newProps = {
      ...defaultProps,
      hibernateClusterResponse: { error: true, errorMessage: 'this is an error' },
    };
    render(<HibernateClusterModal {...newProps} />);
    expect(screen.getByTestId('alert-error')).toBeInTheDocument();
    expect(
      within(screen.getByTestId('alert-error')).getByText('this is an error'),
    ).toBeInTheDocument();
  });

  it('renders correctly when pending', () => {
    const newProps = {
      ...defaultProps,
      hibernateClusterResponse: { pending: true, error: false, fulfilled: false },
    };
    render(<HibernateClusterModal {...newProps} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(within(screen.getByRole('status')).getByText('Loading...')).toBeInTheDocument();
  });

  describe('mounted ', () => {
    it('when cancelled, calls closeModal but not onClose ', async () => {
      const { user } = render(<HibernateClusterModal {...defaultProps} />);
      expect(closeModal).not.toBeCalled();
      expect(resetResponses).not.toBeCalled();
      expect(onClose).not.toBeCalled();

      await user.click(screen.getAllByRole('button', { name: 'Close' })[0]);

      expect(closeModal).toBeCalled();
      expect(resetResponses).toBeCalled();
      expect(onClose).not.toBeCalled();
    });

    it('submits when user clicks on Hibernate cluster button', async () => {
      const { user } = render(<HibernateClusterModal {...defaultProps} />);
      expect(submit).not.toBeCalled();

      await user.click(screen.getByRole('button', { name: 'Hibernate cluster' }));
      expect(submit).toBeCalled();
    });

    it('when fulfilled, closes dialog', () => {
      const fulfilledProps = {
        ...defaultProps,
        hibernateClusterResponse: { fulfilled: true },
      };
      expect(closeModal).not.toBeCalled();
      expect(onClose).not.toBeCalled();
      expect(resetResponses).not.toBeCalled();

      const { rerender } = render(<HibernateClusterModal {...defaultProps} />);
      // simulating a returned success
      rerender(<HibernateClusterModal {...fulfilledProps} />);
      expect(closeModal).toBeCalled();
      expect(resetResponses).toBeCalled();
      expect(onClose).toBeCalled();
    });
  });
});
