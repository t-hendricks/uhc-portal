import React from 'react';
import { shallow } from 'enzyme';

import PullSecretSection from '../PullSecretSection';

describe('<PullSecretSection />', () => {
  describe('PullSecretSection', () => {
    const onCopy = () => jest.fn();
    const copied = false;
    const token = { error: '' };
    const tokenView = 'my token';
    const wrapper = shallow(<PullSecretSection
      copied={copied}
      onCopy={onCopy}
      token={token}
      tokenView={tokenView}
    />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should have Download', () => {
      const download = wrapper.find('Download');
      expect(download.length).toEqual(1);
      const downloadButton = download.find('Button');
      expect(downloadButton.length).toEqual(1);
      expect(downloadButton.props().isDisabled).toEqual(false);
    });
    it('should have Copy', () => {
      const copy = wrapper.find('CopyToClipboard');
      expect(copy.length).toEqual(1);
      const copyButton = copy.find('Button');
      expect(copyButton.length).toEqual(1);
      expect(copyButton.props().isDisabled).toEqual(false);
    });
  });

  describe('PullSecretSection Disabled', () => {
    const onCopy = () => jest.fn();
    const copied = false;
    const token = { error: 'my error' };
    const tokenView = 'my token';
    const wrapper = shallow(<PullSecretSection
      copied={copied}
      onCopy={onCopy}
      token={token}
      tokenView={tokenView}
    />);

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
    it('should disable Download and Copy', () => {
      const download = wrapper.find('Download');
      expect(download.length).toEqual(0);
      const buttons = wrapper.find('Button');
      expect(buttons.length).toEqual(2);
      expect(buttons.at(0).props().isDisabled).toEqual(true);
      expect(buttons.at(1).props().isDisabled).toEqual(true);
    });
  });
});
