import React from 'react';
import { shallow } from 'enzyme';
import { Button } from '@patternfly/react-core';

import DownloadPullSecret from './DownloadPullSecret';

describe('<DownloadPullSecret />', () => {
  describe('with token', () => {
    const token = { auths: { foo: 'bar' } };
    const wrapper = shallow(<DownloadPullSecret token={token} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should have Download', () => {
      const download = wrapper.find(Button);
      expect(download.length).toEqual(1);
      // const downloadButton = download.find(Button);
      // expect(downloadButton.length).toEqual(1);
      expect(download.props().isDisabled).toEqual(false);
    });
  });

  describe('with error', () => {
    const token = { error: 'my error' };
    const wrapper = shallow(<DownloadPullSecret token={token} />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should disable Download', () => {
      const download = wrapper.find('Download');
      expect(download.length).toEqual(0);
      const buttons = wrapper.find(Button);
      expect(buttons.length).toEqual(1);
      expect(buttons.at(0).props().isDisabled).toEqual(true);
    });
  });
});
