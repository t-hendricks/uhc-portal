import React from 'react';
import { shallow } from 'enzyme';

import DownloadsPage, {
  allArchitecturesForTool,
  allOperatingSystemsForTool,
  architecturesForToolOS,
  initialSelection,
  useToolRow,
} from './DownloadsPage';
import {
  tools, operatingSystems, architectures, urls,
} from '../../common/installLinks';

const { linux, mac, windows } = operatingSystems;
const {
  arm, ppc, s390x, x86,
} = architectures;

// These tests depend on installLinks.js data.
describe('allOperatingSystemsForTool', () => {
  it('excludes Windows for installer', () => {
    const values = allOperatingSystemsForTool(tools.INSTALLER).map(o => o.value);
    expect(values).toEqual([linux, mac]);
  });

  it('includes all OSes for oc', () => {
    const values = allOperatingSystemsForTool(tools.CLI_TOOLS).map(o => o.value);
    expect(values).toEqual([linux, mac, windows]);
  });
});

describe('allArchitecturesForTool', () => {
  it('includes arm for odo', () => {
    const values = allArchitecturesForTool(tools.ODO).map(o => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for rosa', () => {
    const values = allArchitecturesForTool(tools.ROSA).map(o => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('architecturesForToolOS', () => {
  it('includes arm for odo Linux', () => {
    const values = architecturesForToolOS(tools.ODO, linux).map(o => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for odo Windows', () => {
    const values = architecturesForToolOS(tools.ODO, windows).map(o => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('useToolRow', () => {
  // By react hook rules, useToolRow must be called inside a functional component.
  // For this test we only want the button from the last cell.
  const ToolRowButton = ({ tool }) => {
    const row = useToolRow(false, tool, 'text');
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
    const initial = initialSelection(tools.CLI_TOOLS, null);
    expect(initial).toEqual({ OS: operatingSystems.linux, architecture: architectures.x86 });
  });

  it('on Linux, chooses x86', () => {
    const initial = initialSelection(tools.CLI_TOOLS, operatingSystems.linux);
    expect(initial).toEqual({ OS: operatingSystems.linux, architecture: architectures.x86 });
  });

  it('on Windows, chooses x86', () => {
    const initial = initialSelection(tools.CLI_TOOLS, operatingSystems.windows);
    expect(initial).toEqual({ OS: operatingSystems.windows, architecture: architectures.x86 });
  });
});

describe('<DownloadsPage>', () => {
  it('renders', () => {
    const wrapper = shallow(<DownloadsPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
