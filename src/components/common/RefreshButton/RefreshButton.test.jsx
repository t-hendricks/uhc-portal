import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import RefreshButton from './RefreshButton';

jest.useFakeTimers('legacy'); // TODO 'modern'

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
    expect(setInterval).toBeCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 60 * 1000);
  });

  it('refreshes after a minute', () => {
    jest.runOnlyPendingTimers();
    expect(onClickFunc).toBeCalled();
  });

  it('does not refresh if autoRefresh has been turned off', () => {
    wrapper.setProps({ autoRefresh: false });
    jest.runOnlyPendingTimers();
    expect(onClickFunc).not.toBeCalled();
  });

  it('clears timer on umount', () => {
    wrapper.unmount();
    expect(clearInterval).toBeCalled();
    jest.runOnlyPendingTimers();
    expect(onClickFunc).not.toBeCalled();
  });
});
