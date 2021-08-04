import React from 'react';
import { shallow } from 'enzyme';

import { tools, channels } from '../../../../../../common/installLinks';
import DownloadAndOSSelection from '../DownloadAndOSSelection';

// only a subset of installLinks.tools are used with DownloadAndOSSelection
const testtools = [
  tools.CLI_TOOLS,
  tools.CRC,
  tools.X86INSTALLER,
  tools.IBMZINSTALLER,
  tools.PPCINSTALLER,
  tools.ARMINSTALLER,
];

const token = { auths: { foo: 'bar' } };

describe('DownloadAndOSSelection', () => test.each(testtools)('%s renders correctly', (tool) => {
  const channel = (tool === tools.ARMINSTALLER) ? channels.PRE_RELEASE : channels.STABLE; // 4.9
  const wrapper = shallow(
    <DownloadAndOSSelection token={token} tool={tool} channel={channel} />,
  );
  expect(wrapper).toMatchSnapshot();
}));

describe('DownloadAndOSSelection', () => {
  describe('with error', () => {
    const badToken = { error: 'my error' };
    const wrapper = shallow(
      <DownloadAndOSSelection
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
