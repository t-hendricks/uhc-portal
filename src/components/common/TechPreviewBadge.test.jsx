import React from 'react';
import { shallow } from 'enzyme';

import TechPreviewBadge from './TechPreviewBadge';

describe('<TechPreviewBadge>', () => {
  it('renders', () => {
    const component = shallow(<TechPreviewBadge />);
    expect(component).toMatchSnapshot();
  });
});
