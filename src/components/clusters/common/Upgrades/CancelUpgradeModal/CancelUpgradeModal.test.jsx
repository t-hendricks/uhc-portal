import React from 'react';
import { mount } from 'enzyme';

import CancelUpgradeModal from './CancelUpgradeModal';

describe('<CancelUpgradeModal />', () => {
  const closeModal = jest.fn();
  const deleteSchedule = jest.fn();
  const clearDeleteScheduleResponse = jest.fn();

  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <CancelUpgradeModal
        isOpen
        closeModal={closeModal}
        deleteSchedule={deleteSchedule}
        deleteScheduleRequest={{}}
        schedule={{
          id: 'foo',
          cluster_id: 'bar',
          version: 'v1.2.3',
          next_run: new Date('2020-11-02').toISOString(),
        }}
        clearDeleteScheduleResponse={clearDeleteScheduleResponse}
        isHypershift={false}
      />,
    );
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('correctly calls deleteSchedule', () => {
    const primaryButton = wrapper.find('Button[variant="primary"]');
    primaryButton.simulate('click');
    expect(deleteSchedule).toBeCalledWith('bar', 'foo', false);
  });

  it('clears request state when fulfilled and closes modal', () => {
    wrapper.setProps({ deleteScheduleRequest: { fulfilled: true } });
    expect(clearDeleteScheduleResponse).toBeCalled();
    expect(closeModal).toBeCalled();
  });
});
