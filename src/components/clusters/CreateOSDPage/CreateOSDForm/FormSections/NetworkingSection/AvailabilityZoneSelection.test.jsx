import React from 'react';
import { shallow } from 'enzyme';
import AvailabilityZoneSelection from './AvailabilityZoneSelection';

describe('<AvailabilityZoneSelection />', () => {
  const onChange = jest.fn();

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <AvailabilityZoneSelection
        label="some label"
        region="fake-region"
        input={{
          value: '',
          onChange,
        }}
        meta={{}}
      />,
    );
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should show error on error', () => {
    wrapper.setProps({ meta: { touched: true, error: 'some error message' } });
    const formGroupProps = wrapper.find('FormGroup').props();
    expect(formGroupProps.helperTextInvalid).toEqual('some error message');
    expect(formGroupProps.validated).toEqual('error');
  });
});
