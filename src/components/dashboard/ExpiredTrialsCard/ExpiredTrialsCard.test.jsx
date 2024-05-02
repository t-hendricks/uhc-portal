import React from 'react';
import { CompatRouter } from 'react-router-dom-v5-compat';

import { checkAccessibility, render, screen, TestRouter } from '~/testUtils';

import { expiredTrials } from '../Dashboard.fixtures';

import ExpiredTrialsCard from './ExpiredTrialsCard';
import { expiredTrialsFilter } from './expiredTrialsHelpers';

const initialState = {
  error: false,
  errorMessage: '',
  pending: false,
  fulfilled: false,
  valid: false,
  items: [],
};

const baseViewOptions = {
  currentPage: 1,
  pageSize: 5,
  totalCount: 0,
  totalPages: 0,
  filter: expiredTrialsFilter,
};

describe('<ExpiredTrialsCard />', () => {
  const getSubscriptions = jest.fn();
  const openModal = jest.fn();

  describe('When the request was not fulfilled', () => {
    const initialProps = {
      openModal,
      getSubscriptions,
      viewOptions: baseViewOptions,
      subscriptions: initialState,
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('return null', () => {
      const { container } = render(
        <TestRouter>
          <CompatRouter>
            <ExpiredTrialsCard {...initialProps} />
          </CompatRouter>
        </TestRouter>,
      );

      expect(container).toBeEmptyDOMElement();
    });

    it('calls getSubscriptions on mount', () => {
      expect(getSubscriptions).not.toBeCalled();
      render(<ExpiredTrialsCard {...initialProps} />);
      expect(getSubscriptions).toBeCalled();
    });
  });

  describe('When data is available', () => {
    const dataAvailableProps = {
      openModal,
      getSubscriptions,
      viewOptions: baseViewOptions,
      subscriptions: {
        ...initialState,
        items: expiredTrials,
      },
    };
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('is accessible', async () => {
      const { container } = render(
        <TestRouter>
          <CompatRouter>
            <ExpiredTrialsCard {...dataAvailableProps} />
          </CompatRouter>
        </TestRouter>,
      );
      expect(await screen.findByText('Expired Trials')).toBeInTheDocument();
      expect(await screen.findByRole('grid')).toBeInTheDocument();
      await checkAccessibility(container);
    });
  });
});
