import React from 'react';
import { shallow } from 'enzyme';

import LiveDateFormat from './LiveDateFormat';

describe('<LiveDateFormat />', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('1 Jan 2021 00:00:00 GMT').getTime());
  });

  it('renders correctly', () => {
    const wrapper = shallow(<LiveDateFormat timestamp={Date.now()} />);
    expect(wrapper).toMatchSnapshot();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
