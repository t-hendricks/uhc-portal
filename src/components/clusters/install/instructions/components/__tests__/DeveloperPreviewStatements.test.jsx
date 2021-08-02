import React from 'react';
import { shallow } from 'enzyme';

import DeveloperPreviewStatements from '../DeveloperPreviewStatements';

describe('DeveloperPreviewStatements', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<DeveloperPreviewStatements />);
    expect(wrapper).toMatchSnapshot();
  });
});
