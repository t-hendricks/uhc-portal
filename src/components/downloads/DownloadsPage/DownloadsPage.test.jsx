import React from 'react';
import { shallow } from 'enzyme';

import DownloadsPage, {
  allArchitecturesForTool,
  allOperatingSystemsForTool,
  architecturesForToolOS,
  initialSelection,
  toolRow,
} from './DownloadsPage';
import {
  tools, channels, operatingSystems, architectures, urls,
} from '../../../common/installLinks';

const { linux, mac, windows } = operatingSystems;
const {
  arm, ppc, s390x, x86,
} = architectures;

// These tests depend on installLinks.js data.
describe('allOperatingSystemsForTool', () => {
  it('excludes Windows for installer', () => {
    const values = allOperatingSystemsForTool(urls, tools.X86INSTALLER,
      channels.STABLE).map(o => o.value);
    expect(values).toEqual([linux, mac]);
  });

  it('includes all OSes for oc', () => {
    const values = allOperatingSystemsForTool(urls, tools.CLI_TOOLS, channels.STABLE)
      .map(o => o.value);
    expect(values).toEqual([linux, mac, windows]);
  });
});

describe('allArchitecturesForTool', () => {
  it('includes arm for odo', () => {
    const values = allArchitecturesForTool(urls, tools.ODO, channels.STABLE)
      .map(o => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for rosa', () => {
    const values = allArchitecturesForTool(urls, tools.ROSA, channels.STABLE)
      .map(o => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('architecturesForToolOS', () => {
  it('includes arm for odo Linux', () => {
    const values = architecturesForToolOS(urls, tools.ODO, channels.STABLE, linux)
      .map(o => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for odo Windows', () => {
    const values = architecturesForToolOS(urls, tools.ODO, channels.STABLE, windows)
      .map(o => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('toolRow', () => {
  // For this test we only want the button from the last cell.
  const ToolRowButton = ({ tool }) => {
    const expanded = { [tool]: false };
    const selections = {};
    const setSelections = () => { };
    const channel = (tool === tools.ARMINSTALLER) ? channels.PRE_RELEASE : channels.STABLE; // 4.9
    const row = toolRow(expanded, selections, setSelections, urls, tool, channel, 'text');
    return row.cells[row.cells.length - 1].title;
  };

  Object.keys(tools).forEach((tool) => {
    if (urls[tool]) { // skip tools that have no data yet
      it(`initially ${tool} button has a url`, () => {
        const wrapper = shallow(<ToolRowButton tool={tool} />);
        wrapper.find('DownloadButton').forEach((w) => {
          expect(w.props().url).toBeDefined();
        });
      });
    }
  });
});

describe('initialSelection', () => {
  it('when detection fails, chooses Linux, x86', () => {
    const initial = initialSelection(urls, tools.CLI_TOOLS, channels.STABLE, null);
    expect(initial).toEqual({ OS: linux, architecture: architectures.x86 });
  });

  it('on Linux, chooses x86', () => {
    const initial = initialSelection(urls, tools.CLI_TOOLS, channels.STABLE, linux);
    expect(initial).toEqual({ OS: linux, architecture: architectures.x86 });
  });

  it('on Windows, chooses x86', () => {
    const initial = initialSelection(urls, tools.CLI_TOOLS, channels.STABLE, windows);
    expect(initial).toEqual({ OS: windows, architecture: architectures.x86 });
  });
});

describe('<DownloadsPage>', () => {
  it('renders', () => {
    const props = {
      token: { auths: { foo: 'bar' } },
      getAuthToken: () => { },
      githubReleases: {
        'redhat-developer/app-services-cli': {
          fulfilled: true,
          data: {
            tag_name: 'v0.25.0',
            foo: 'bar',
          },
        },
        'openshift-online/ocm-cli': {
          fulfilled: false,
        },
      },
      getLatestRelease: () => { },
    };

    const wrapper = shallow(<DownloadsPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
