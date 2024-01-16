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
    expect(wrapper.find('FormGroupHelperText').props().error).toEqual('some error message');
  });
});
