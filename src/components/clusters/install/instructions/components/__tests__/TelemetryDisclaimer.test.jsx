import React from 'react';
import { shallow } from 'enzyme';

import TelemetryDisclaimer from '../TelemetryDisclaimer';

describe('TelemetryDisclaimer', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TelemetryDisclaimer />);
    expect(wrapper).toMatchSnapshot();
  });
});
