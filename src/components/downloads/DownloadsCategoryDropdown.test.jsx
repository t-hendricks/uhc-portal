import React from 'react';
import { shallow } from 'enzyme';

import DownloadsCategoryDropdown from './DownloadsCategoryDropdown';

describe('<DownloadsCategoryDropdown />', () => {
  const wrapper = shallow(<DownloadsCategoryDropdown selectedCategory="DEV" setCategory={() => {}} />);

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
