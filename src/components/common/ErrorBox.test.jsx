import React from 'react';
import { shallow } from 'enzyme';

import ErrorBox from './ErrorBox';

const baseResponse = {
  errorMessage: 'this is some error message',
};

describe('<ErroBox />', () => {
  it('should render without Operation ID', () => {
    const wrapper = shallow(<ErrorBox message="some error description" response={baseResponse} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with Operation ID', () => {
    const wrapper = shallow(<ErrorBox message="some error message" response={{ ...baseResponse, operationID: 'hello' }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
