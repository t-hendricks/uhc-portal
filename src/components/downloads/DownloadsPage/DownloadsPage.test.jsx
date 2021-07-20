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
    const values = allOperatingSystemsForTool(tools.INSTALLER,
      channels.STABLE).map(o => o.value);
    expect(values).toEqual([linux, mac]);
  });

  it('includes all OSes for oc', () => {
    const values = allOperatingSystemsForTool(tools.CLI_TOOLS, channels.STABLE).map(o => o.value);
    expect(values).toEqual([linux, mac, windows]);
  });
});

describe('allArchitecturesForTool', () => {
  it('includes arm for odo', () => {
    const values = allArchitecturesForTool(tools.ODO, channels.STABLE).map(o => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for rosa', () => {
    const values = allArchitecturesForTool(tools.ROSA, channels.STABLE).map(o => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('architecturesForToolOS', () => {
  it('includes arm for odo Linux', () => {
    const values = architecturesForToolOS(tools.ODO, channels.STABLE, linux).map(o => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for odo Windows', () => {
    const values = architecturesForToolOS(tools.ODO, channels.STABLE, windows).map(o => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('toolRow', () => {
  // By react hook rules, toolRow must be called inside a functional component.
  // For this test we only want the button from the last cell.
  const ToolRowButton = ({ tool }) => {
    const channel = channels.STABLE;
    const initial = initialSelection(tool, channel, null);
    const row = toolRow({ [tool]: false }, { [tool]: initial }, () => {}, tool, channel, 'text');
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
    const initial = initialSelection(tools.CLI_TOOLS, channels.STABLE, null);
    expect(initial).toEqual({ OS: operatingSystems.linux, architecture: architectures.x86 });
  });

  it('on Linux, chooses x86', () => {
    const initial = initialSelection(tools.CLI_TOOLS, channels.STABLE, operatingSystems.linux);
    expect(initial).toEqual({ OS: operatingSystems.linux, architecture: architectures.x86 });
  });

  it('on Windows, chooses x86', () => {
    const initial = initialSelection(tools.CLI_TOOLS, channels.STABLE, operatingSystems.windows);
    expect(initial).toEqual({ OS: operatingSystems.windows, architecture: architectures.x86 });
  });
});

describe('<DownloadsPage>', () => {
  it('renders', () => {
    const token = { auths: { foo: 'bar' } };
    const wrapper = shallow(<DownloadsPage token={token} getAuthToken={() => {}} />);
    expect(wrapper).toMatchSnapshot();
  });
});
