import React from 'react';
import { shallow } from 'enzyme';
import GlobalErrorBox from './GlobalErrorBox';

describe('<GlobalErrorBox />', () => {
  it('should render', () => {
    const wrapper = shallow(<GlobalErrorBox errorMessage="hello" clearGlobalError={jest.fn()} />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should not render when errorMessage is empty', () => {
    const wrapper = shallow(<GlobalErrorBox clearGlobalError={jest.fn()} />);
    expect(wrapper).toMatchSnapshot();
  });
});
