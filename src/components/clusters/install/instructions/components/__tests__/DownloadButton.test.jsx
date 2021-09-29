import React from 'react';
import { shallow } from 'enzyme';
import { get } from 'lodash';

import {
  urls,
  architectures,
  operatingSystems,
  tools,
  channels,
} from '../../../../../../common/installLinks';
import DownloadButton from '../DownloadButton';

describe('DownloadButton', () => {
  const tool = tools.OC;
  const channel = channels.STABLE;
  const url = get(urls, [tool, channel, architectures.x86, operatingSystems.linux]);
  it('renders correctly', () => {
    const wrapper = shallow(<DownloadButton url={url} tool={tool} channel={channel} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe('when disabled', () => {
    const wrapper = shallow(<DownloadButton disabled download={false} text="Not available" />);
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
