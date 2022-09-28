import React from 'react';
import { shallow } from 'enzyme';

import ClusterListFilter from './ClusterListFilter';

jest.useFakeTimers('legacy'); // TODO 'modern'

describe('<ClusterListFilter />', () => {
  let setFilter;
  let wrapper;
  let wrapperWithPrefilledText;

  beforeEach(() => {
    setFilter = jest.fn();
    wrapper = shallow(<ClusterListFilter setFilter={setFilter} currentFilter="" />);

    wrapperWithPrefilledText = shallow(
      <ClusterListFilter setFilter={setFilter} currentFilter="hello" />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapperWithPrefilledText).toMatchSnapshot();
  });

  it('sets up a timeout properly', () => {
    wrapper.find('.cluster-list-filter').simulate('change', 'hello');
    expect(setTimeout).toBeCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300);
  });

  it('calls setFilter after timeout has passed', () => {
    wrapper.find('.cluster-list-filter').simulate('change', 'world');
    jest.runOnlyPendingTimers();
    expect(setFilter).toHaveBeenCalledWith('world');
  });

  it('calls setFilter only when the user stops typing', () => {
    wrapper.find('.cluster-list-filter').simulate('change', 'a');
    wrapper.find('.cluster-list-filter').simulate('change', 'abc');
    jest.runOnlyPendingTimers();
    expect(setFilter).not.toHaveBeenCalledWith('a');
    expect(setFilter).toHaveBeenCalledWith('abc');
  });
});
