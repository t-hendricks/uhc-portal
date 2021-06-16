import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import DownloadsSection from './DownloadsSection';

describe('<DownloadsSection />', () => {
  describe('with same category selected', () => {
    const wrapper = shallow(
      <DownloadsSection selectedCategory="DEV" category="DEV">
        <Button>placeholder for test</Button>
      </DownloadsSection>,
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should contain title & children', () => {
      expect(wrapper.html()).toContain('Developer tools');
      expect(wrapper.find(Button).length).toEqual(1);
    });
  });

  describe('with ALL category selected', () => {
    const wrapper = shallow(
      <DownloadsSection selectedCategory="ALL" category="DEV">
        <Button>placeholder for test</Button>
      </DownloadsSection>,
    );

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should contain title & children', () => {
      expect(wrapper.html()).toContain('Developer tools');
      expect(wrapper.find(Button).length).toEqual(1);
    });
  });

  describe('with different category selected', () => {
    const wrapper = shallow(
      <DownloadsSection selectedCategory="CLI" category="DEV">
        <Button>placeholder for test</Button>
      </DownloadsSection>,
    );

    it('should render as empty', () => {
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.text()).toEqual('');
    });
  });
});
