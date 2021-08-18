import React from 'react';
import { shallow } from 'enzyme';
import ReduxFormTagsInput from '../ReduxFormTagsInput';

describe('<ReduxFormTagsInput />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<ReduxFormTagsInput tags={['hello=world', 'foo=bar']} meta={{ error: undefined }} input={{ onChange: jest.fn() }} />);
  });

  it('should render with tags', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render without tags', () => {
    wrapper.setProps({ tags: [] });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with error', () => {
    wrapper.setProps({ meta: { error: 'Error message', dirty: true } });
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div[className="pf-c-form__helper-text pf-m-error"]').length).toEqual(1);
  });
});
