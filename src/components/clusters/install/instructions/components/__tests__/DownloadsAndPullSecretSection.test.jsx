import React from 'react';
import { shallow } from 'enzyme';

import { tools, channels } from '../../../../../../common/installLinks.mjs';
import DownloadsAndPullSecretSection from '../DownloadsAndPullSecretSection';

describe('DownloadsAndPullSecretSection', () => {
  describe('with token', () => {
    const token = { auths: { foo: 'bar' } };
    const wrapper = shallow(
      <DownloadsAndPullSecretSection
        token={token}
        tool={tools.X86INSTALLER}
        channel={channels.STABLE}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('with error', () => {
    const badToken = { error: 'my error' };
    const wrapper = shallow(
      <DownloadsAndPullSecretSection
        token={badToken}
        tool={tools.X86INSTALLER}
        channel={channels.STABLE}
      />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
