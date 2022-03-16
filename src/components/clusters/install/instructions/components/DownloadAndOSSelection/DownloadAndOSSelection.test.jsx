import React from 'react';
import { shallow } from 'enzyme';

import { tools, channels } from '../../../../../../common/installLinks';
import DownloadAndOSSelection from './DownloadAndOSSelection';

// only a subset of installLinks.tools are used with DownloadAndOSSelection
const testtools = [
  tools.OC,
  tools.CRC,
  tools.X86INSTALLER,
  tools.IBMZINSTALLER,
  tools.PPCINSTALLER,
  tools.ARMINSTALLER,
];

const token = { auths: { foo: 'bar' } };

const props = {
  channel: channels.STABLE,
  githubReleases: {
    'redhat-developer/app-services-cli': {
      fulfilled: false,
    },
    'openshift-online/ocm-cli': {
      fulfilled: true,
      data: {
        tag_name: 'v0.1.60',
        foo: 'bar',
      },
    },
  },
  getLatestRelease: () => { },
};

describe('DownloadAndOSSelection', () => test.each(testtools)('%s renders correctly', (tool) => {
  const wrapper = shallow(
    <DownloadAndOSSelection token={token} tool={tool} {...props} />,
  );
  expect(wrapper).toMatchSnapshot();
}));

describe('DownloadAndOSSelection', () => {
  describe('with error', () => {
    const badToken = { error: 'my error' };
    const wrapper = shallow(
      <DownloadAndOSSelection token={badToken} tool={tools.X86INSTALLER} {...props} />,
    );
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
