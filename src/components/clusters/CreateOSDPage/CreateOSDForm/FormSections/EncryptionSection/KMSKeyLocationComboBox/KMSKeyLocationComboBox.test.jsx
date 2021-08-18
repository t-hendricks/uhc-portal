import React from 'react';
import { mount } from 'enzyme';

import DisconnectedKMSKeyLocationComboBox from './KMSKeyLocationComboBox';

const kmsRegionsArray = ['us-east-1', 'global'];

describe('<KMSKeyLocationComboBox />', () => {
  describe('when location needs to be fetched', () => {
    let wrapper;
    let onChange;

    beforeEach(() => {
      onChange = jest.fn();
      wrapper = mount(
        <DisconnectedKMSKeyLocationComboBox
          input={{ onChange }}
          kmsRegionsArray={kmsRegionsArray}
        />,
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
