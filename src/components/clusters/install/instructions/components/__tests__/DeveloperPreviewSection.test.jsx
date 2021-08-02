import React from 'react';
import { shallow } from 'enzyme';

import DeveloperPreviewSection from '../DeveloperPreviewSection';

describe('DeveloperPreviewSection', () => {
  describe('with default parameters', () => {
    it('renders correctly', () => {
      const wrapper = shallow(<DeveloperPreviewSection />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with devPreviewLink', () => {
    it('renders correctly', () => {
      const wrapper = shallow(
        <DeveloperPreviewSection devPreviewLink="/install/ibmz/pre-release" />,
      );
      expect(wrapper).toMatchSnapshot();
    });
  });
});
