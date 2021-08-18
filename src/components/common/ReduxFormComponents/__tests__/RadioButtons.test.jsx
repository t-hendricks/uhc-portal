import React from 'react';
import { shallow } from 'enzyme';
import RadioButtons from '../RadioButtons';

describe('<RadioButtons />', () => {
  const props = {
    defaultValue: 'test-default',
    onChangeCallback: jest.fn(),
    input: {
      name: 'test-radio-buttons',
      onChange: jest.fn(),
    },
    className: 'test-classname',
    options: [
      {
        label: 'Option 1',
        value: 'option-1',
      },
      {
        label: 'the default',
        value: 'test-default',
      },
    ],

  };

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<RadioButtons {...props} />);
  });

  it('should render - basic', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Radio').length).toEqual(2);
  });

  it('should call onChange to change to default value', () => {
    expect(props.input.onChange).toBeCalledWith('test-default');
  });

  it('should call onChange properly when changed', () => {
    // TODO not sure why we have both onChange and onChangeCallback
    const option = wrapper.find('Radio[value="option-1"]');
    const mockEvent = { target: { value: option.props().value } };
    option.simulate('change', undefined, mockEvent);
    expect(props.input.onChange).toHaveBeenLastCalledWith('option-1', mockEvent);
    expect(props.onChangeCallback).toHaveBeenLastCalledWith('test-radio-buttons', 'option-1');
  });

  it('should revert to default when value is changed to empty string', () => {
    wrapper.setProps({ input: { ...props.input, value: '' } });
    expect(props.input.onChange).toHaveBeenLastCalledWith('test-default');
  });
});
