import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CompatRouter } from 'react-router-dom-v5-compat';
import { mockRestrictedEnv, render, screen, checkAccessibility, waitFor } from '~/testUtils';
import accountsService from '~/services/accountsService';
import DownloadsPage, {
  allArchitecturesForTool,
  allOperatingSystemsForTool,
  architecturesForToolOS,
  initialSelection,
  downloadChoice,
} from './DownloadsPage';
import {
  tools,
  channels,
  operatingSystems,
  architectures,
  urls,
} from '../../../common/installLinks.mjs';

const { linux, mac, windows } = operatingSystems;
const { arm, ppc, s390x, x86 } = architectures;

jest.mock('~/services/accountsService');

// These tests depend on installLinks.mjs data.
describe('allOperatingSystemsForTool', () => {
  it('excludes Windows for installer', () => {
    const values = allOperatingSystemsForTool(urls, tools.X86INSTALLER, channels.STABLE).map(
      (o) => o.value,
    );
    expect(values).toEqual([linux, mac]);
  });

  it('includes all OSes for oc', () => {
    const values = allOperatingSystemsForTool(urls, tools.OC, channels.STABLE).map((o) => o.value);
    expect(values).toEqual([linux, mac, windows]);
  });
});

describe('allArchitecturesForTool', () => {
  it('includes arm for odo', () => {
    const values = allArchitecturesForTool(urls, tools.ODO, channels.STABLE).map((o) => o.value);
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for rosa', () => {
    const values = allArchitecturesForTool(urls, tools.ROSA, channels.STABLE).map((o) => o.value);
    expect(values).toEqual([x86]);
  });
});

describe('architecturesForToolOS', () => {
  it('includes arm for odo Linux', () => {
    const values = architecturesForToolOS(urls, tools.ODO, channels.STABLE, linux).map(
      (o) => o.value,
    );
    expect(values).toEqual([x86, arm, ppc, s390x]);
  });

  it('has only x86 for odo Windows', () => {
    const values = architecturesForToolOS(urls, tools.ODO, channels.STABLE, windows).map(
      (o) => o.value,
    );
    expect(values).toEqual([x86]);
  });
});

describe('downloadChoice', () => {
  // For this test we only want the button from the last cell.
  Object.values(tools).forEach((tool) => {
    const selections = {};
    const setSelections = () => {};
    const chooser = downloadChoice(selections, setSelections, urls, tool, channels.STABLE, 'text');

    if (urls[tool]) {
      // skip tools that have no data yet
      it(`initially ${tool} button has a url`, () => {
        const { getByRole } = render(chooser.downloadButton);

        const downloadButton = getByRole('link');
        expect(downloadButton).toHaveAttribute('href', expect.stringMatching(/.+/));
      });
    }
  });
});

describe('initialSelection', () => {
  it('when detection fails, chooses Linux, x86', () => {
    // If user has some exotic browser/OS, it's more convenient to select _something_
    // so all Download buttons work, than force user to choose in all rows.
    const initial = initialSelection(urls, tools.OC, channels.STABLE, null);
    expect(initial).toEqual({ OS: linux, architecture: architectures.x86 });
  });

  it('on Linux, chooses x86', () => {
    const initial = initialSelection(urls, tools.OC, channels.STABLE, linux);
    expect(initial).toEqual({ OS: linux, architecture: architectures.x86 });
  });

  it('on Windows, chooses x86', () => {
    const initial = initialSelection(urls, tools.OC, channels.STABLE, windows);
    expect(initial).toEqual({ OS: windows, architecture: architectures.x86 });
  });

  it('when not available for detected OS, chooses first option Linux x86', () => {
    // The concrete use case is Windows user, installer is only available for Linux & Mac.
    // Plausible behaviors in that case:
    //  1. keep download disabled, force user to "Select OS".
    //     Benefit: user will not miss that this row needs a different OS from the rest.
    //  2. pre-select first OS - Linux.
    //     Benefit: user needs _something_ and Linux is more useful (WSL, free VMs).
    const initial = initialSelection(urls, tools.X86INSTALLER, channels.STABLE, windows);
    expect(initial).toEqual({ OS: linux, architecture: architectures.x86 });
  });
});

describe('<DownloadsPage>', () => {
  const getAuthToken = jest.fn();
  const getLatestRelease = jest.fn();

  const props = {
    location: { hash: '' },
    token: { auths: { foo: 'bar' } },
    getAuthToken,
    githubReleases: {
      'redhat-developer/app-services-cli': {
        fulfilled: true,
        data: {
          tag_name: 'v0.40.0',
          foo: 'bar',
        },
      },
      'openshift-online/ocm-cli': {
        fulfilled: false,
      },
    },
    getLatestRelease,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.skip('is accessible', async () => {
    const { container } = render(
      <MemoryRouter>
        <CompatRouter>
          <DownloadsPage {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );
    // This fails with a   "IDs used in ARIA and labels must be unique (duplicate-id-aria)" error
    await checkAccessibility(container);
  });

  it('expand all', async () => {
    const { user } = render(
      <MemoryRouter>
        <CompatRouter>
          <DownloadsPage {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    const expandBtn = screen.getByRole('button', { name: /expand all/i });

    await user.click(expandBtn);

    const expandButtons = screen.getAllByRole('button', { name: /details/i });
    expandButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('Fetches organization data', async () => {
    render(
      <MemoryRouter>
        <CompatRouter>
          <DownloadsPage {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );
    expect(await accountsService.getCurrentAccount).toHaveBeenCalled();
    expect(accountsService.getOrganization).toHaveBeenCalled();
  });

  it('Hides api token section if using offline tokens is restricted', async () => {
    accountsService.getOrganization.mockResolvedValue({
      data: {
        organization: {
          capabilities: [
            {
              inherited: false,
              name: 'capability.organization.enable_data_sovereign_regions',
              value: 'true',
            },
            {
              inherited: false,
              name: 'capability.account.restrict_new_offline_tokens',
              value: 'true',
            },
            {
              inherited: false,
              name: 'capability.cluster.subscribed_ocp',
              value: 'true',
            },
          ],
        },
      },
    });
    render(
      <MemoryRouter>
        <CompatRouter>
          <DownloadsPage {...props} />
        </CompatRouter>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.queryByText('OpenShift Cluster Manager API Token')).not.toBeInTheDocument();
    });
  });

  describe('in restricted env', () => {
    const isRestrictedEnv = mockRestrictedEnv();
    afterEach(() => {
      isRestrictedEnv.mockReturnValue(false);
    });
    it('renders only OC/ROSA CLI and tokens', () => {
      const props = {
        location: { hash: '' },
        token: { auths: { foo: 'bar' } },
        getAuthToken: () => {},
        githubReleases: {
          'redhat-developer/app-services-cli': {
            fulfilled: true,
            data: {
              tag_name: 'v0.40.0',
              foo: 'bar',
            },
          },
          'openshift-online/ocm-cli': {
            fulfilled: false,
          },
        },
        getLatestRelease: () => {},
      };
      isRestrictedEnv.mockReturnValue(true);
      render(
        <MemoryRouter>
          <CompatRouter>
            <DownloadsPage {...props} />
          </CompatRouter>
        </MemoryRouter>,
      );
      expect(screen.getAllByTestId(/downloads-section-.*/)).toHaveLength(2);

      expect(screen.getByTestId('downloads-section-CLI')).toBeInTheDocument();
      expect(screen.getByTestId('downloads-section-TOKENS')).toBeInTheDocument();

      expect(screen.getAllByTestId(/expandable-row-.*/)).toHaveLength(4);
      expect(screen.getByTestId('expandable-row-oc')).toBeInTheDocument();
      expect(screen.getByTestId('expandable-row-rosa')).toBeInTheDocument();
    });
  });
});
