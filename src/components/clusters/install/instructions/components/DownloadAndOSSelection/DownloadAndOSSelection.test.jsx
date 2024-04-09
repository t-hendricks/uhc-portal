import React from 'react';

import * as useAnalyticsHook from '~/hooks/useAnalytics';
import { checkAccessibility, render, screen } from '~/testUtils';

import { channels, tools } from '../../../../../../common/installLinks.mjs';

import DownloadAndOSSelection from './DownloadAndOSSelection';

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
  getLatestRelease: () => {},
};

describe('<DownloadAndOSSelection />', () => {
  const useAnalytics = jest.fn();
  jest.spyOn(useAnalyticsHook, 'default').mockImplementation(() => useAnalytics);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('is accessible', async () => {
    const { container } = render(<DownloadAndOSSelection tool={tools.X86INSTALLER} {...props} />);

    const osDropdown = screen.getByRole('combobox', { name: 'Select OS dropdown' });
    expect(osDropdown).toBeInTheDocument();
    expect(osDropdown).not.toBeDisabled();

    const architectureDropdown = screen.getByRole('combobox', {
      name: 'Select architecture dropdown',
    });
    expect(architectureDropdown).toBeInTheDocument();
    expect(architectureDropdown).toBeDisabled();

    const downloadButton = screen.getByRole('link', { name: 'Download installer' });
    expect(downloadButton).toBeInTheDocument();
    expect(downloadButton).not.toBeDisabled();

    await checkAccessibility(container);
  });

  it(' pendoID is sent to useAnalytics call', async () => {
    const pendoId = 'myPendoId';
    const { user } = render(
      <DownloadAndOSSelection tool={tools.X86INSTALLER} {...props} pendoID={pendoId} />,
    );
    await user.click(screen.getByRole('link', { name: 'Download installer' }));

    const useAnalyticsParams = useAnalytics.mock.calls[0];

    expect(useAnalyticsParams[1].path).toEqual(pendoId);
  });
});
