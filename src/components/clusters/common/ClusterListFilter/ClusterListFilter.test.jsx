import React from 'react';
import { mount } from 'enzyme';

import ClusterListFilter from './ClusterListFilter';

jest.useFakeTimers('legacy'); // TODO 'modern'

describe('<ClusterListFilter />', () => {
  let setFilter;
  let wrapper;
  let wrapperWithPrefilledText;

  beforeEach(() => {
    setFilter = jest.fn();
    wrapper = mount(<ClusterListFilter setFilter={setFilter} currentFilter="" />);

    wrapperWithPrefilledText = mount(
      <ClusterListFilter setFilter={setFilter} currentFilter="hello" />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapperWithPrefilledText).toMatchSnapshot();
  });

  it('sets up a timeout properly', () => {
    wrapper.find('input').simulate('change', { target: { value: 'hello' } });
    expect(setTimeout).toBeCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300);
  });

  it('calls setFilter after timeout has passed', () => {
    wrapper.find('input').simulate('change', { target: { value: 'world' } });
    jest.runOnlyPendingTimers();
    expect(setFilter).toHaveBeenCalledWith('world');
  });

  it('calls setFilter only when the user stops typing', () => {
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: 'a' } });
    input.simulate('change', { target: { value: 'abc' } });

    jest.runOnlyPendingTimers();

    expect(setFilter).not.toHaveBeenCalledWith('a');
    expect(setFilter).toHaveBeenCalledWith('abc');
  });
});
