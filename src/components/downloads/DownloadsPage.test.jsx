import {
  allOperatingSystemsForTool, allArchitecturesForTool, architecturesForToolOS,
} from './DownloadsPage';
import {
  tools, operatingSystems, architectures,
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
