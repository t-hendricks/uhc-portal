import React from 'react';
import { shallow } from 'enzyme';

import FlatRadioButton from './FlatRadioButton';

const props: React.ComponentProps<typeof FlatRadioButton> = {
  titleText: 'hello',
  secondaryText: 'test',
  value: 'valuable',
  onChange: jest.fn(),
};

describe('<FlatRadioButton />', () => {
  it('should render when disabled', () => {
    const wrapper = shallow(<FlatRadioButton disableReason="out of cheese" {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render when selected', () => {
    const wrapper = shallow(<FlatRadioButton isSelected {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render normally', () => {
    const wrapper = shallow(<FlatRadioButton {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should call onChange correctly', () => {
    const wrapper = shallow(<FlatRadioButton {...props} />);
    wrapper.simulate('click');
    expect(props.onChange).toBeCalledWith(props.value);
  });
  it('should pass through extra props to the Button', () => {
    const wrapper = shallow(<FlatRadioButton {...props} title="hello world!" />);
    expect(wrapper).toMatchSnapshot();
  });
});
