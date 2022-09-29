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
    const wrapper = shallow(
      <ErrorBox
        message="some error message"
        response={{ ...baseResponse, operationID: 'hello' }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with warning variant', () => {
    const wrapper = shallow(
      <ErrorBox message="some error description" response={baseResponse} variant="warning" />,
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render expandable', () => {
    const wrapper = shallow(
      <ErrorBox message="some error description" response={baseResponse} isExpandable />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
