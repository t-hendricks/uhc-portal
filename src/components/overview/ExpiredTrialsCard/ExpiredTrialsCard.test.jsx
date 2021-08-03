import React from 'react';
import { shallow } from 'enzyme';
import ExpiredTrialsCard from './ExpiredTrialsCard';
import { expiredTrials } from '../Overview.fixtures';
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
  let getSubscriptions;
  let wrapper;
  const openModal = jest.fn();
  describe('When the request was not fulfilled', () => {
    beforeEach(() => {
      getSubscriptions = jest.fn();
      wrapper = shallow(
        <ExpiredTrialsCard
          openModal={openModal}
          getSubscriptions={getSubscriptions}
          viewOptions={baseViewOptions}
          subscriptions={initialState}
        />,
      );
    });
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('calls getSubscriptions on mount', () => {
      expect(getSubscriptions).toBeCalled();
    });
  });

  describe('When data is available', () => {
    beforeEach(() => {
      getSubscriptions = jest.fn();
      const subscriptions = {
        ...initialState,
        items: expiredTrials,
      };
      wrapper = shallow(
        <ExpiredTrialsCard
          openModal={openModal}
          getSubscriptions={getSubscriptions}
          viewOptions={baseViewOptions}
          subscriptions={subscriptions}
        />,
      );
    });
    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
