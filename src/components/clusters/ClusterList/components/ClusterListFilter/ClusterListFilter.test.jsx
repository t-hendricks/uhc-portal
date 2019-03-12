import React from 'react';
import { shallow } from 'enzyme';

import ClusterListFilter from './ClusterListFilter';

jest.useFakeTimers();

describe('<ClusterListFilter />', () => {
  let setFilter;
  let wrapper;
  let wrapperWithPrefilledText;
  const fakeEvent = input => ({
    preventDefault() {},
    target: { value: input },
  });
  beforeEach(() => {
    setFilter = jest.fn();
    wrapper = shallow(<ClusterListFilter
      setFilter={setFilter}
      currentFilter=""
    />);

    wrapperWithPrefilledText = shallow(<ClusterListFilter
      setFilter={setFilter}
      currentFilter="hello"
    />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapperWithPrefilledText).toMatchSnapshot();
  });

  it('sets up a timeout properly', () => {
    wrapper.find('FormControl').simulate('change', fakeEvent('hello'));
    expect(setTimeout).toBeCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300);
  });

  it('calls setFilter after timeout has passed', () => {
    wrapper.find('FormControl').simulate('change', fakeEvent('world'));
    jest.runOnlyPendingTimers();
    expect(setFilter).toHaveBeenCalledWith('world');
  });

  it('calls setFilter only when the user stops typing', () => {
    wrapper.find('FormControl').simulate('change', fakeEvent('a'));
    wrapper.find('FormControl').simulate('change', fakeEvent('abc'));
    jest.runOnlyPendingTimers();
    expect(setFilter).not.toHaveBeenCalledWith('a');
    expect(setFilter).toHaveBeenCalledWith('abc');
  });
});
