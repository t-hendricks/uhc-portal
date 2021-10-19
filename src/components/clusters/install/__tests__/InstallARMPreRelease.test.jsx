import React from 'react';
import { shallow } from 'enzyme';

import { InstallARMPreRelease } from '../InstallARMPreRelease';

describe('InstallARMPreRelease', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<InstallARMPreRelease token={{}} dispatch={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
