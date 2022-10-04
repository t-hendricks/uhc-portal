import React from 'react';
import { mount, shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import RefreshButton from './RefreshButton';

jest.useFakeTimers();
jest.spyOn(global, 'clearInterval');
jest.spyOn(global, 'setInterval');

// Times set for refresh, change here if the corresponding var are changed within the component file
const shortTimerSeconds = 10;
const longTimerSeconds = 60;
const numberOfShortTries = 3;

describe('<RefreshButton />', () => {
  let onClickFunc;
  let refreshFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<RefreshButton id="id" refreshFunc={onClickFunc} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls refreshFunc when clicked', () => {
    wrapper.find(Button).simulate('click');
    expect(onClickFunc).toBeCalled();
  });

  it("doesn't call setInterval when autoRefresh is disabled", () => {
    expect(setInterval).not.toBeCalled();
  });
  it("doesn't call onClickFunc when autoRefresh is disabled", () => {
    wrapper = mount(<RefreshButton id="id" refreshFunc={onClickFunc} />);
    jest.advanceTimersByTime(longTimerSeconds * 1000);
    expect(onClickFunc).not.toBeCalled();
  });

  describe('with a refreshFunc and clickRefreshFunc', () => {
    it('calls clickRefreshFunc when clicked', () => {
      refreshFunc = jest.fn();
      onClickFunc = jest.fn();
      wrapper = shallow(
        <RefreshButton id="id" refreshFunc={refreshFunc} clickRefreshFunc={onClickFunc} />,
      );
      wrapper.find(Button).simulate('click');
      expect(refreshFunc).not.toBeCalled();
      expect(onClickFunc).toBeCalled();
    });
  });
});

describe('<RefreshButton autoRefresh />', () => {
  let onClickFunc;
  let wrapper;
  beforeEach(() => {
    onClickFunc = jest.fn();
    wrapper = shallow(<RefreshButton id="id" autoRefresh refreshFunc={onClickFunc} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('calls refreshFunc when clicked', () => {
    wrapper.find(Button).simulate('click');
    expect(onClickFunc).toBeCalled();
  });

  it('sets up the interval', () => {
    wrapper = mount(<RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh />);
    expect(setInterval).toBeCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), longTimerSeconds * 1000);
  });

  it('refreshes after a minute', () => {
    wrapper = mount(<RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh />);
    jest.advanceTimersByTime(longTimerSeconds * 1000);
    expect(onClickFunc).toBeCalled();
  });

  it('does not refresh if autoRefresh has been turned off', () => {
    wrapper = mount(<RefreshButton id="id" refreshFunc={onClickFunc} />);
    jest.advanceTimersByTime(longTimerSeconds * 1000);
    expect(onClickFunc).not.toBeCalled();
  });

  it('clears timer on umount', () => {
    wrapper = mount(<RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh />);
    wrapper.unmount();
    expect(clearInterval).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(onClickFunc).not.toBeCalled();
  });

  describe('Short timer', () => {
    it('refreshes on shorter cycle if useShortTimer is set', () => {
      // checking to see if we have valid data
      expect(shortTimerSeconds * 2).toBeLessThan(longTimerSeconds);
      wrapper = mount(
        <RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh useShortTimer />,
      );
      jest.advanceTimersByTime(shortTimerSeconds * 2 * 1000);
      expect(onClickFunc).toBeCalledTimes(2);
    });

    it('refreshes on long cycle if useShortTimer is not set', () => {
      // checking to see if we have valid data
      expect(shortTimerSeconds * 2).toBeLessThan(longTimerSeconds);
      wrapper = mount(<RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh />);
      jest.advanceTimersByTime(longTimerSeconds * 1000);
      expect(onClickFunc).toBeCalledTimes(1);
    });

    it('goes back to long cycle if useShortTimer is set for n attempts', () => {
      // Time for n short cycles and 1 long cycle
      const expectedTime = (shortTimerSeconds * numberOfShortTries + longTimerSeconds) * 1000;
      wrapper = mount(
        <RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh useShortTimer />,
      );
      jest.advanceTimersByTime(expectedTime);
      expect(onClickFunc).toBeCalledTimes(numberOfShortTries + 1);
    });

    it('switches from short timer to long timer if useShortTimer is switched from true to false', () => {
      wrapper = mount(
        <RefreshButton id="id" refreshFunc={onClickFunc} autoRefresh useShortTimer />,
      );
      jest.advanceTimersByTime(shortTimerSeconds * 1000);
      wrapper.setProps({ useShortTimer: false });
      jest.advanceTimersByTime(longTimerSeconds * 1000);
      expect(onClickFunc).toBeCalledTimes(2);
    });
  });
});
